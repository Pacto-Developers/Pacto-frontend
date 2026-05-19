import {
  apiFetch,
  isApiConfigured,
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
import { fetchWithFallback } from "./fetch-with-fallback";
import {
  extractMissionGuidelines,
  mapApiCampaign,
  mapApiMission,
  mapApiWalletHistory,
} from "./mappers";
import type {
  ApiCampaign,
  ApiLoginResponse,
  ApiMission,
  ApiWalletBalance,
  ApiWalletHistory,
  WithSource,
} from "./types";

const PATHS = {
  campaigns: "/api/v1/campaigns",
  campaign: (id: string) => `/api/v1/campaigns/${id}`,
  acceptMission: (campaignId: string) =>
    `/api/v1/campaigns/${campaignId}/missions`,
  myMissions: "/api/v1/missions/me",
  submitMission: (escrowId: string) => `/api/v1/missions/${escrowId}/submit`,
  walletBalance: "/api/v1/wallets/me",
  walletHistories: "/api/v1/wallets/me/histories",
  login: "/api/v1/auth/login",
  me: "/api/v1/users/me",
} as const;

export async function getCampaigns(): Promise<WithSource<Campaign[]>> {
  return fetchWithFallback(async () => {
    const res = await apiFetch<unknown>(PATHS.campaigns);
    return unwrapList<ApiCampaign>(res).map(mapApiCampaign);
  }, mockCampaigns);
}

export async function getCampaign(
  id: string,
): Promise<WithSource<Campaign | null>> {
  const fallback = mockCampaigns.find((c) => c.id === id) ?? null;

  return fetchWithFallback(async () => {
    const dto = await apiFetch<ApiCampaign>(PATHS.campaign(id));
    return mapApiCampaign(dto);
  }, fallback);
}

export async function getCampaignGuidelines(
  id: string,
): Promise<WithSource<string[]>> {
  const fallback = mockMissionGuidelines;

  return fetchWithFallback(async () => {
    const dto = await apiFetch<ApiCampaign>(PATHS.campaign(id));
    const guides = extractMissionGuidelines(dto);
    return guides.length > 0 ? guides : fallback;
  }, fallback);
}

export async function getMyMissions(): Promise<WithSource<Mission[]>> {
  return fetchWithFallback(async () => {
    const res = await apiFetch<unknown>(PATHS.myMissions);
    return unwrapList<ApiMission>(res).map(mapApiMission);
  }, mockMissions);
}

export async function acceptMission(
  campaignId: string,
): Promise<WithSource<{ ok: boolean }>> {
  if (!isApiConfigured()) {
    return { data: { ok: true }, source: "mock" };
  }

  try {
    await apiFetch(PATHS.acceptMission(campaignId), { method: "POST" });
    return { data: { ok: true }, source: "api" };
  } catch {
    return { data: { ok: true }, source: "mock" };
  }
}

export async function submitMissionUrl(
  escrowId: string,
  url: string,
): Promise<WithSource<{ ok: boolean }>> {
  if (!isApiConfigured()) {
    return { data: { ok: true }, source: "mock" };
  }

  try {
    await apiFetch(PATHS.submitMission(escrowId), {
      method: "PATCH",
      body: JSON.stringify({ url }),
    });
    return { data: { ok: true }, source: "api" };
  } catch {
    return { data: { ok: true }, source: "mock" };
  }
}

export async function getWalletBalance(): Promise<WithSource<number>> {
  return fetchWithFallback(async () => {
    const dto = await apiFetch<ApiWalletBalance>(PATHS.walletBalance);
    return dto.balance ?? dto.point ?? dto.amount ?? 0;
  }, 120000);
}

export async function getWalletHistories(): Promise<
  WithSource<WalletHistory[]>
> {
  return fetchWithFallback(async () => {
    const res = await apiFetch<unknown>(PATHS.walletHistories);
    return unwrapList<ApiWalletHistory>(res).map(mapApiWalletHistory);
  }, mockWalletHistory);
}

/** 서버 라우트·로그인 폼에서 사용 */
export async function loginWithApi(
  email: string,
  password: string,
): Promise<ApiLoginResponse | null> {
  if (!isApiConfigured()) return null;

  try {
    return await apiFetch<ApiLoginResponse>(PATHS.login, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  if (!isApiConfigured()) return null;

  try {
    return await apiFetch(PATHS.me);
  } catch {
    return null;
  }
}
