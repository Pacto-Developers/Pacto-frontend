import { apiFetch } from "./client";
import type { Paginated } from "./pagination";

export type EscrowStatus = "LOCKED" | "RELEASED" | "CANCELED";

export type EscrowListItem = {
  escrow_id: number;
  campaign_id: number;
  campaign_title: string;
  blogger_name: string;
  amount: number;
  status: EscrowStatus;
  created_at: string;
};

export type ListEscrowsParams = {
  page?: number;
  status?: EscrowStatus;
};

export type ReleaseEscrowResult = {
  escrow_id: number;
  status: "RELEASED";
  settlement_info: {
    blogger_id: number;
    released_amount: number;
    released_at: string;
  };
};

export type CancelEscrowResult = {
  escrow_id: number;
  status: "CANCELED";
  refund_info: {
    advertiser_id: number;
    refunded_amount: number;
    refunded_at: string;
  };
};

function buildQuery(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, value);
  }
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function listEscrows(
  token: string,
  params: ListEscrowsParams = {},
): Promise<Paginated<EscrowListItem>> {
  const query = buildQuery({
    status: params.status,
    page: String(params.page ?? 1),
  });

  return apiFetch<Paginated<EscrowListItem>>(`/api/v1/escrows${query}`, {
    token,
  });
}

export async function releaseEscrow(
  token: string,
  escrowId: string | number,
): Promise<ReleaseEscrowResult> {
  return apiFetch<ReleaseEscrowResult>(`/api/v1/escrows/${escrowId}/release`, {
    method: "POST",
    token,
  });
}

export async function cancelEscrow(
  token: string,
  escrowId: string | number,
  reason?: string,
): Promise<CancelEscrowResult> {
  return apiFetch<CancelEscrowResult>(`/api/v1/escrows/${escrowId}/cancel`, {
    method: "POST",
    token,
    body: JSON.stringify(reason ? { reason } : {}),
  });
}
