import "server-only";

import {
  ApiClientError,
  approveMission as approveMissionApi,
  cancelEscrow as cancelEscrowApi,
  cancelMission as cancelMissionApi,
  listEscrows as listEscrowsApi,
  releaseEscrow as releaseEscrowApi,
  type EscrowListItem,
  type EscrowStatus,
  type ListEscrowsParams,
  type MissionCancelReason,
} from "@pacto/api-client";
import { isMockToken } from "./bff-route";

export type EscrowRow = EscrowListItem & {
  mission_status?: "LOCKED" | "SUBMITTED" | "RELEASED" | "CANCELED";
  submitted_url?: string | null;
};

const mockEscrows: EscrowRow[] = [
  {
    escrow_id: 101,
    campaign_id: 1,
    campaign_title: "강남역 팝업스토어 리뷰",
    blogger_name: "블로거A",
    amount: 50000,
    status: "LOCKED",
    mission_status: "SUBMITTED",
    submitted_url: "https://blog.example.com/review-a",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    escrow_id: 102,
    campaign_id: 1,
    campaign_title: "강남역 팝업스토어 리뷰",
    blogger_name: "블로거B",
    amount: 50000,
    status: "LOCKED",
    mission_status: "LOCKED",
    submitted_url: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    escrow_id: 103,
    campaign_id: 2,
    campaign_title: "신메뉴 시식단 모집",
    blogger_name: "블로거C",
    amount: 30000,
    status: "RELEASED",
    mission_status: "RELEASED",
    submitted_url: "https://blog.example.com/review-c",
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

export async function fetchEscrows(
  token: string,
  params: ListEscrowsParams = {},
) {
  if (isMockToken(token)) {
    let items = [...mockEscrows];
    if (params.status) {
      items = items.filter((e) => e.status === params.status);
    }
    return {
      content: items,
      current_page: params.page ?? 1,
      total_pages: 1,
    };
  }

  return listEscrowsApi(token, params);
}

function findMockEscrow(escrowId: string) {
  const row = mockEscrows.find((e) => String(e.escrow_id) === escrowId);
  if (!row) {
    throw new ApiClientError(404, "존재하지 않는 에스크로입니다.");
  }
  return row;
}

export async function patchApproveMission(token: string, escrowId: string) {
  if (isMockToken(token)) {
    const row = findMockEscrow(escrowId);
    if (row.mission_status !== "SUBMITTED") {
      throw new ApiClientError(400, "제출 완료(SUBMITTED) 미션만 승인할 수 있습니다.");
    }
    row.mission_status = "RELEASED";
    row.status = "RELEASED";
    return {
      escrow_id: row.escrow_id,
      status: "RELEASED" as const,
      released_at: new Date().toISOString(),
    };
  }

  return approveMissionApi(token, escrowId);
}

export async function patchCancelMission(
  token: string,
  escrowId: string,
  reason: MissionCancelReason,
) {
  if (isMockToken(token)) {
    const row = findMockEscrow(escrowId);
    if (row.status === "RELEASED") {
      throw new ApiClientError(400, "이미 완료된 미션은 취소할 수 없습니다.");
    }
    row.mission_status = "CANCELED";
    row.status = "CANCELED";
    return {
      escrow_id: row.escrow_id,
      status: "CANCELED" as const,
      refunded_point: row.amount,
      canceled_at: new Date().toISOString(),
    };
  }

  return cancelMissionApi(token, escrowId, reason);
}

export async function postReleaseEscrow(token: string, escrowId: string) {
  if (isMockToken(token)) {
    const row = findMockEscrow(escrowId);
    row.status = "RELEASED";
    row.mission_status = "RELEASED";
    return {
      escrow_id: row.escrow_id,
      status: "RELEASED" as const,
      settlement_info: {
        blogger_id: 1,
        released_amount: row.amount,
        released_at: new Date().toISOString(),
      },
    };
  }

  return releaseEscrowApi(token, escrowId);
}

export async function postCancelEscrow(
  token: string,
  escrowId: string,
  reason?: string,
) {
  if (isMockToken(token)) {
    const row = findMockEscrow(escrowId);
    if (row.status === "RELEASED") {
      throw new ApiClientError(400, "이미 정산된 에스크로는 취소할 수 없습니다.");
    }
    row.status = "CANCELED";
    row.mission_status = "CANCELED";
    return {
      escrow_id: row.escrow_id,
      status: "CANCELED" as const,
      refund_info: {
        advertiser_id: 1,
        refunded_amount: row.amount,
        refunded_at: new Date().toISOString(),
      },
    };
  }

  return cancelEscrowApi(token, escrowId, reason);
}

export function parseEscrowStatus(value: string | null): EscrowStatus | undefined {
  const allowed: EscrowStatus[] = ["LOCKED", "RELEASED", "CANCELED"];
  return allowed.includes(value as EscrowStatus)
    ? (value as EscrowStatus)
    : undefined;
}
