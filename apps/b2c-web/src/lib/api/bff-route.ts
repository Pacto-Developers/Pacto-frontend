import "server-only";

import { getServerAccessToken } from "@/lib/auth-server";
import { isAuthenticated } from "@/lib/auth";
import {
  ApiClientError,
  acceptMission as acceptMissionApi,
  getMyMissions as getMyMissionsApi,
  getWalletBalance as getWalletBalanceApi,
  getWalletHistories as getWalletHistoriesApi,
  isApiConfigured,
  submitMissionUrl as submitMissionUrlApi,
  withdrawWallet as withdrawWalletApi,
  type MissionStatus,
  type MyMissionsParams,
  type WithdrawWalletRequest,
} from "@pacto/api-client";
import {
  applyMockWithdraw,
  getMockWallet,
  getMockWalletHistories,
} from "@/lib/api/mock-wallet-store";
import { NextResponse } from "next/server";

const MIN_WITHDRAW_AMOUNT = 10_000;

export async function requireBffToken() {
  const token = await getServerAccessToken();

  if (!isAuthenticated(token)) {
    return {
      error: NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 }),
    } as const;
  }

  return { token: token! } as const;
}

export function isMockToken(token: string): boolean {
  return token === "mock" || !isApiConfigured();
}

export async function fetchMyMissions(
  token: string,
  params: MyMissionsParams = {},
) {
  return getMyMissionsApi(token, params);
}

export async function postAcceptMission(token: string, campaignId: string) {
  if (isMockToken(token)) {
    return { escrow_id: Date.now(), status: "LOCKED" as const };
  }

  return acceptMissionApi(token, campaignId);
}

export async function patchSubmitMission(
  token: string,
  escrowId: string,
  submittedUrl: string,
) {
  if (isMockToken(token)) {
    return {
      escrow_id: Number(escrowId),
      status: "SUBMITTED" as const,
      submitted_url: submittedUrl,
      updated_at: new Date().toISOString(),
    };
  }

  return submitMissionUrlApi(token, escrowId, submittedUrl);
}

export async function fetchWalletBalance(token: string) {
  if (isMockToken(token)) {
    const mock = getMockWallet();
    return {
      wallet_id: 0,
      balance: mock.balance,
      locked_balance: mock.locked_balance,
      updated_at: new Date().toISOString(),
    };
  }

  return getWalletBalanceApi(token);
}

export async function postWithdrawWallet(
  token: string,
  request: WithdrawWalletRequest,
) {
  if (request.amount < MIN_WITHDRAW_AMOUNT) {
    throw new ApiClientError(400, "최소 출금 금액은 10,000원입니다.");
  }

  if (isMockToken(token)) {
    const result = applyMockWithdraw(request.amount);
    if (!result) {
      throw new ApiClientError(409, "잔액이 부족합니다.");
    }
    return result;
  }

  return withdrawWalletApi(token, request);
}

export async function fetchWalletHistories(token: string, page = 1) {
  if (isMockToken(token)) {
    return {
      content: getMockWalletHistories(),
      current_page: page,
      total_pages: 1,
    };
  }

  return getWalletHistoriesApi(token, page);
}

export function bffErrorResponse(error: unknown) {
  if (error instanceof ApiClientError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status >= 400 ? error.status : 502 },
    );
  }

  return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
}

export function parseMissionStatus(
  value: string | null,
): MissionStatus | undefined {
  const allowed: MissionStatus[] = [
    "LOCKED",
    "SUBMITTED",
    "RELEASED",
    "CANCELED",
  ];
  return allowed.includes(value as MissionStatus)
    ? (value as MissionStatus)
    : undefined;
}
