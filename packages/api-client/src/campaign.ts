import { apiFetch } from "./client";
import type { Paginated } from "./pagination";

export type CampaignStatus = "OPEN" | "CLOSED" | "CANCELED";

export type CampaignListItem = {
  campaign_id: number;
  title: string;
  category: string;
  reward_point: number;
  total_slots: number;
  remaining_slots: number;
  deadline: string;
  status: CampaignStatus;
  d_day: number;
};

export type CreateCampaignRequest = {
  title: string;
  description: string;
  category: string;
  reward_point: number;
  total_slots: number;
  deadline: string;
  requirements?: string[];
};

export type CreateCampaignResult = {
  campaign_id: number;
  status: CampaignStatus;
  created_at: string;
};

export type UpdateCampaignStatusResult = {
  campaign_id: number;
  status: CampaignStatus;
  updated_at: string;
};

export type ListCampaignsParams = {
  status?: CampaignStatus;
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

export async function listCampaigns(
  params: ListCampaignsParams = {},
  token?: string,
): Promise<Paginated<CampaignListItem>> {
  const query = buildQuery({
    status: params.status,
    page: String(params.page ?? 0),
    size: String(params.size ?? 20),
  });

  return apiFetch<Paginated<CampaignListItem>>(`/api/v1/campaigns${query}`, {
    token,
  });
}

export async function createCampaign(
  token: string,
  request: CreateCampaignRequest,
): Promise<CreateCampaignResult> {
  return apiFetch<CreateCampaignResult>("/api/v1/campaigns", {
    method: "POST",
    token,
    body: JSON.stringify(request),
  });
}

export async function updateCampaignStatus(
  token: string,
  campaignId: string | number,
  status: CampaignStatus,
): Promise<UpdateCampaignStatusResult> {
  return apiFetch<UpdateCampaignStatusResult>(
    `/api/v1/campaigns/${campaignId}/status`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify({ status }),
    },
  );
}
