import type { CampaignStatus } from "@pacto/api-client";
import { bffRequest } from "./bff";

export type AdminCampaign = {
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

export type CreateCampaignInput = {
  title: string;
  description: string;
  category: string;
  reward_point: number;
  total_slots: number;
  deadline: string;
  requirements?: string[];
};

export async function getAdvertiserCampaigns(status?: CampaignStatus) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return bffRequest<AdminCampaign[]>(`/api/bff/campaigns${query}`);
}

export async function createAdvertiserCampaign(input: CreateCampaignInput) {
  return bffRequest<{ campaign_id: number; status: CampaignStatus }>(
    "/api/bff/campaigns",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function changeCampaignStatus(
  campaignId: string,
  status: CampaignStatus,
) {
  return bffRequest<{ campaign_id: number; status: CampaignStatus }>(
    `/api/bff/campaigns/${campaignId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
}
