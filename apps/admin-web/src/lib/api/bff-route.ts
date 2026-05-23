import "server-only";

import { getServerAccessToken } from "@/lib/auth-server";
import { isAuthenticated } from "@/lib/auth";
import {
  ApiClientError,
  createCampaign as createCampaignApi,
  isApiConfigured,
  listCampaigns as listCampaignsApi,
  updateCampaignStatus as updateCampaignStatusApi,
  type CampaignListItem,
  type CampaignStatus,
  type CreateCampaignRequest,
  type ListCampaignsParams,
} from "@pacto/api-client";
import { NextResponse } from "next/server";

const mockCampaigns: CampaignListItem[] = [
  {
    campaign_id: 1,
    title: "강남역 팝업스토어 리뷰",
    category: "맛집",
    reward_point: 50000,
    total_slots: 20,
    remaining_slots: 15,
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    status: "OPEN",
    d_day: 7,
  },
  {
    campaign_id: 2,
    title: "신메뉴 시식단 모집",
    category: "뷰티",
    reward_point: 30000,
    total_slots: 10,
    remaining_slots: 0,
    deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
    status: "CLOSED",
    d_day: 3,
  },
];

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

export async function fetchCampaigns(
  token: string,
  params: ListCampaignsParams = {},
) {
  if (isMockToken(token)) {
    let items = [...mockCampaigns];
    if (params.status) {
      items = items.filter((c) => c.status === params.status);
    }
    return {
      content: items,
      page: params.page ?? 0,
      size: params.size ?? 20,
      total_elements: items.length,
      total_pages: 1,
    };
  }

  return listCampaignsApi(params, token);
}

export async function postCreateCampaign(
  token: string,
  request: CreateCampaignRequest,
) {
  if (isMockToken(token)) {
    const campaign: CampaignListItem = {
      campaign_id: Date.now(),
      title: request.title,
      category: request.category,
      reward_point: request.reward_point,
      total_slots: request.total_slots,
      remaining_slots: request.total_slots,
      deadline: request.deadline,
      status: "OPEN",
      d_day: 7,
    };
    mockCampaigns.unshift(campaign);
    return {
      campaign_id: campaign.campaign_id,
      status: "OPEN" as const,
      created_at: new Date().toISOString(),
    };
  }

  return createCampaignApi(token, request);
}

export async function patchCampaignStatus(
  token: string,
  campaignId: string,
  status: CampaignStatus,
) {
  if (isMockToken(token)) {
    const campaign = mockCampaigns.find(
      (c) => String(c.campaign_id) === campaignId,
    );
    if (!campaign) {
      throw new ApiClientError(404, "존재하지 않는 캠페인입니다.");
    }
    campaign.status = status;
    return {
      campaign_id: campaign.campaign_id,
      status,
      updated_at: new Date().toISOString(),
    };
  }

  return updateCampaignStatusApi(token, campaignId, status);
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
