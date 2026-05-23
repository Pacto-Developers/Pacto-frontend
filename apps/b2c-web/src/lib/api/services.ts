import {
  apiFetch,
  unwrapList,
} from "@pacto/api-client";
import {
  campaigns as mockCampaigns,
  missionGuidelines as mockMissionGuidelines,
  missions as mockMissions,
  walletHistory as mockWalletHistory,
  type Campaign,
  type Mission,
  type WalletHistory,
} from "@/lib/mock-data";
import { bffRequest } from "./bff";
import { fetchWithFallback } from "./fetch-with-fallback";
import {
  extractMissionGuidelines,
  mapApiCampaign,
  mapApiMission,
  mapApiWalletHistory,
} from "./mappers";
import type { WalletBalanceView } from "./wallet-types";
import type {
  ApiCampaign,
  ApiMission,
  ApiWalletHistory,
  WithSource,
} from "./types";

const PUBLIC_PATHS = {
  campaigns: "/api/v1/campaigns",
  campaign: (id: string) => `/api/v1/campaigns/${id}`,
} as const;

const BFF_PATHS = {
  missions: "/api/bff/missions",
  acceptMission: "/api/bff/missions/accept",
  submitMission: (escrowId: string) => `/api/bff/missions/${escrowId}/submit`,
  walletBalance: "/api/bff/wallet/balance",
  walletHistories: "/api/bff/wallet/histories",
  walletWithdraw: "/api/bff/wallet/withdraw",
} as const;

export type WithdrawResult = {
  withdrawId: number;
  requestedAmount: number;
  remainingBalance: number;
  status: string;
};

export type WithdrawParams = {
  amount: number;
  bankName?: string;
  accountNumber?: string;
};

export async function getCampaigns(): Promise<WithSource<Campaign[]>> {
  return fetchWithFallback(async () => {
    const res = await apiFetch<unknown>(PUBLIC_PATHS.campaigns);
    return unwrapList<ApiCampaign>(res).map(mapApiCampaign);
  }, mockCampaigns);
}

export async function getCampaign(
  id: string,
): Promise<WithSource<Campaign | null>> {
  const fallback = mockCampaigns.find((c) => c.id === id) ?? null;

  return fetchWithFallback(async () => {
    const dto = await apiFetch<ApiCampaign>(PUBLIC_PATHS.campaign(id));
    return mapApiCampaign(dto);
  }, fallback);
}

export async function getCampaignGuidelines(
  id: string,
): Promise<WithSource<string[]>> {
  const fallback = mockMissionGuidelines;

  return fetchWithFallback(async () => {
    const dto = await apiFetch<ApiCampaign>(PUBLIC_PATHS.campaign(id));
    const guides = extractMissionGuidelines(dto);
    return guides.length > 0 ? guides : fallback;
  }, fallback);
}

export async function getMyMissions(
  status?: string,
): Promise<WithSource<Mission[]>> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";

  try {
    return await bffRequest<Mission[]>(`${BFF_PATHS.missions}${query}`);
  } catch {
    return { data: mockMissions, source: "mock" };
  }
}

export async function acceptMission(
  campaignId: string,
): Promise<WithSource<{ ok: boolean }>> {
  try {
    return await bffRequest<{ ok: boolean }>(BFF_PATHS.acceptMission, {
      method: "POST",
      body: JSON.stringify({ campaignId }),
    });
  } catch {
    return { data: { ok: true }, source: "mock" };
  }
}

export async function submitMissionUrl(
  escrowId: string,
  url: string,
): Promise<WithSource<{ ok: boolean }>> {
  try {
    return await bffRequest<{ ok: boolean }>(BFF_PATHS.submitMission(escrowId), {
      method: "PATCH",
      body: JSON.stringify({ submitted_url: url }),
    });
  } catch {
    return { data: { ok: true }, source: "mock" };
  }
}

export async function getWalletBalance(): Promise<WithSource<WalletBalanceView>> {
  try {
    const result = await bffRequest<{
      balance: number;
      lockedBalance?: number;
    }>(BFF_PATHS.walletBalance);
    return {
      data: {
        balance: result.data.balance,
        lockedBalance: result.data.lockedBalance ?? 0,
      },
      source: result.source,
    };
  } catch {
    return {
      data: { balance: 120_000, lockedBalance: 50_000 },
      source: "mock",
    };
  }
}

export async function getWalletHistories(): Promise<
  WithSource<WalletHistory[]>
> {
  try {
    return await bffRequest<WalletHistory[]>(BFF_PATHS.walletHistories);
  } catch {
    return { data: mockWalletHistory, source: "mock" };
  }
}

export async function withdrawWallet(
  params: WithdrawParams,
): Promise<WithSource<WithdrawResult>> {
  return bffRequest<WithdrawResult>(BFF_PATHS.walletWithdraw, {
    method: "POST",
    body: JSON.stringify({
      amount: params.amount,
      bank_name: params.bankName,
      account_number: params.accountNumber,
    }),
  });
}
