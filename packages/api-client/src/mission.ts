import { apiFetch } from "./client";
import type { Paginated } from "./pagination";

export type MissionStatus = "LOCKED" | "SUBMITTED" | "RELEASED" | "CANCELED";

export type MissionListItem = {
  escrow_id: number;
  campaign_title: string;
  reward_point: number;
  status: MissionStatus;
  deadline: string;
  submitted_url: string | null;
};

export type AcceptMissionResult = {
  escrow_id: number;
  campaign_id: number;
  blogger_id: number;
  reward_point: number;
  status: MissionStatus;
  deadline: string;
  created_at: string;
};

export type SubmitMissionResult = {
  escrow_id: number;
  status: MissionStatus;
  submitted_url: string;
  updated_at: string;
};

export type MyMissionsParams = {
  status?: MissionStatus;
  page?: number;
  size?: number;
};

function buildQuery(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, value);
  }
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function getMyMissions(
  token: string,
  params: MyMissionsParams = {},
): Promise<Paginated<MissionListItem>> {
  const query = buildQuery({
    status: params.status,
    page: String(params.page ?? 0),
    size: String(params.size ?? 10),
  });

  return apiFetch<Paginated<MissionListItem>>(`/api/v1/missions/me${query}`, {
    token,
  });
}

export async function acceptMission(
  token: string,
  campaignId: string | number,
): Promise<AcceptMissionResult> {
  return apiFetch<AcceptMissionResult>(
    `/api/v1/campaigns/${campaignId}/missions`,
    {
      method: "POST",
      token,
    },
  );
}

export async function submitMissionUrl(
  token: string,
  escrowId: string | number,
  submittedUrl: string,
): Promise<SubmitMissionResult> {
  return apiFetch<SubmitMissionResult>(
    `/api/v1/missions/${escrowId}/submit`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify({ submitted_url: submittedUrl }),
    },
  );
}

export type ApproveMissionResult = {
  escrow_id: number;
  status: "RELEASED";
  released_at: string;
};

export type MissionCancelReason =
  | "DEADLINE_EXCEEDED"
  | "BLOGGER_REQUEST"
  | "ADVERTISER_REJECT";

export type CancelMissionResult = {
  escrow_id: number;
  status: "CANCELED";
  refunded_point: number;
  canceled_at: string;
};

export async function approveMission(
  token: string,
  escrowId: string | number,
): Promise<ApproveMissionResult> {
  return apiFetch<ApproveMissionResult>(
    `/api/v1/missions/${escrowId}/approve`,
    {
      method: "PATCH",
      token,
    },
  );
}

export async function cancelMission(
  token: string,
  escrowId: string | number,
  reason: MissionCancelReason,
): Promise<CancelMissionResult> {
  return apiFetch<CancelMissionResult>(`/api/v1/missions/${escrowId}/cancel`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ reason }),
  });
}
