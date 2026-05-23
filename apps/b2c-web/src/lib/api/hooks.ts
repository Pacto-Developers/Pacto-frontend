"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Campaign, Mission, WalletHistory } from "@/lib/mock-data";
import type { WalletBalanceView } from "./wallet-types";
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
  withdrawWallet,
  type WithdrawParams,
  type WithdrawResult,
} from "./services";
import { fetchMe } from "./user";

export const queryKeys = {
  me: ["me"] as const,
  campaigns: ["campaigns"] as const,
  campaign: (id: string) => ["campaigns", id] as const,
  campaignGuidelines: (id: string) => ["campaigns", id, "guidelines"] as const,
  missions: ["missions", "me"] as const,
  walletBalance: ["wallet", "balance"] as const,
  walletHistories: ["wallet", "histories"] as const,
};

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
  });
}

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

export function useMyMissions(status?: string) {
  return useQuery<WithSource<Mission[]>>({
    queryKey: status ? [...queryKeys.missions, status] : queryKeys.missions,
    queryFn: () => getMyMissions(status),
  });
}

export function useWalletBalance() {
  return useQuery<WithSource<WalletBalanceView>>({
    queryKey: queryKeys.walletBalance,
    queryFn: getWalletBalance,
  });
}

export function useWalletHistories() {
  return useQuery<WithSource<WalletHistory[]>>({
    queryKey: queryKeys.walletHistories,
    queryFn: getWalletHistories,
  });
}

export function useWithdrawWallet() {
  const queryClient = useQueryClient();

  return useMutation<WithSource<WithdrawResult>, Error, WithdrawParams>({
    mutationFn: withdrawWallet,
    onSuccess: (result) => {
      queryClient.setQueryData<WithSource<WalletBalanceView>>(
        queryKeys.walletBalance,
        (prev) => ({
          data: {
            balance: result.data.remainingBalance,
            lockedBalance: prev?.data.lockedBalance ?? 0,
          },
          source: result.source,
        }),
      );
      void queryClient.invalidateQueries({ queryKey: queryKeys.walletHistories });
    },
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ escrowId, url }: { escrowId: string; url: string }) =>
      submitMissionUrl(escrowId, url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.missions });
    },
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
