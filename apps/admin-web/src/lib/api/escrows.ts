import type {
  EscrowListItem,
  EscrowStatus,
  MissionCancelReason,
} from "@pacto/api-client";
import { bffRequest } from "./bff";

export type EscrowRow = EscrowListItem & {
  mission_status?: "LOCKED" | "SUBMITTED" | "RELEASED" | "CANCELED";
  submitted_url?: string | null;
};

export async function getEscrows(status?: EscrowStatus) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return bffRequest<EscrowRow[]>(`/api/bff/escrows${query}`);
}

export async function approveMissionEscrow(escrowId: string) {
  return bffRequest<{ escrow_id: number; status: string }>(
    `/api/bff/missions/${escrowId}/approve`,
    { method: "PATCH" },
  );
}

export async function cancelMissionEscrow(
  escrowId: string,
  reason: MissionCancelReason,
) {
  return bffRequest<{ escrow_id: number; status: string }>(
    `/api/bff/missions/${escrowId}/cancel`,
    {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    },
  );
}

export async function releaseEscrowFunds(escrowId: string) {
  return bffRequest<{ escrow_id: number; status: string }>(
    `/api/bff/escrows/${escrowId}/release`,
    { method: "POST" },
  );
}

export async function cancelEscrowFunds(escrowId: string, reason?: string) {
  return bffRequest<{ escrow_id: number; status: string }>(
    `/api/bff/escrows/${escrowId}/cancel`,
    {
      method: "POST",
      body: JSON.stringify({ reason }),
    },
  );
}
