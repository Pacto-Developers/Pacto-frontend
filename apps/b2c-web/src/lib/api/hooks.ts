"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Campaign, Mission } from "@/lib/mock-data";
import type { WithSource } from "./types";
import {
  acceptMission,
  getCampaign,
  getCampaignGuidelines,
  getCampaigns,
  getMyMissions,
  getWalletBalance,
  getWalletHistories,
  submitMissionUrl,
} from "./services";

export const queryKeys = {
  campaigns: ["campaigns"] as const,
  campaign: (id: string) => ["campaigns", id] as const,
  campaignGuidelines: (id: string) => ["campaigns", id, "guidelines"] as const,
  missions: ["missions", "me"] as const,
  walletBalance: ["wallet", "balance"] as const,
  walletHistories: ["wallet", "histories"] as const,
};

export function useCampaigns() {
  return useQuery({
    queryKey: queryKeys.campaigns,
    queryFn: getCampaigns,
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: queryKeys.campaign(id),
    queryFn: () => getCampaign(id),
    enabled: Boolean(id),
  });
}

export function useCampaignGuidelines(id: string) {
  return useQuery({
    queryKey: queryKeys.campaignGuidelines(id),
    queryFn: () => getCampaignGuidelines(id),
    enabled: Boolean(id),
  });
}

export function useMyMissions() {
  return useQuery({
    queryKey: queryKeys.missions,
    queryFn: getMyMissions,
  });
}

export function useWalletBalance() {
  return useQuery({
    queryKey: queryKeys.walletBalance,
    queryFn: getWalletBalance,
  });
}

export function useWalletHistories() {
  return useQuery({
    queryKey: queryKeys.walletHistories,
    queryFn: getWalletHistories,
  });
}

export function useAcceptMission(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => acceptMission(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.missions });
    },
  });
}

export function useSubmitMissionUrl() {
  return useMutation({
    mutationFn: ({ escrowId, url }: { escrowId: string; url: string }) =>
      submitMissionUrl(escrowId, url),
  });
}

/** 쿼리 결과에서 UI용 목록 추출 */
export function selectCampaignList(
  result: WithSource<Campaign[]> | undefined,
): Campaign[] {
  return result?.data ?? [];
}

export function selectMissionList(
  result: WithSource<Mission[]> | undefined,
): Mission[] {
  return result?.data ?? [];
}
