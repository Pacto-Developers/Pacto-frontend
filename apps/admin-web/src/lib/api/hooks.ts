"use client";

import type { CampaignStatus, EscrowStatus, MissionCancelReason } from "@pacto/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeCampaignStatus,
  createAdvertiserCampaign,
  getAdvertiserCampaigns,
  type CreateCampaignInput,
} from "./campaigns";
import {
  approveMissionEscrow,
  cancelEscrowFunds,
  cancelMissionEscrow,
  getEscrows,
  releaseEscrowFunds,
} from "./escrows";
import {
  getAdvertiserPayment,
  getAdvertiserWalletBalance,
  prepareAdvertiserPayment,
} from "./payments";

export const campaignKeys = {
  list: (status?: CampaignStatus) => ["campaigns", status ?? "all"] as const,
};

export const escrowKeys = {
  list: (status?: EscrowStatus) => ["escrows", status ?? "all"] as const,
};

export const walletKeys = {
  balance: ["wallet", "balance"] as const,
};

export function useAdvertiserCampaigns(status?: CampaignStatus) {
  return useQuery({
    queryKey: campaignKeys.list(status),
    queryFn: () => getAdvertiserCampaigns(status),
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCampaignInput) => createAdvertiserCampaign(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useUpdateCampaignStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      campaignId,
      status,
    }: {
      campaignId: string;
      status: CampaignStatus;
    }) => changeCampaignStatus(campaignId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useEscrows(status?: EscrowStatus) {
  return useQuery({
    queryKey: escrowKeys.list(status),
    queryFn: () => getEscrows(status),
  });
}

function invalidateEscrows(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["escrows"] });
}

export function useApproveMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (escrowId: string) => approveMissionEscrow(escrowId),
    onSuccess: () => invalidateEscrows(queryClient),
  });
}

export function useCancelMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      escrowId,
      reason,
    }: {
      escrowId: string;
      reason: MissionCancelReason;
    }) => cancelMissionEscrow(escrowId, reason),
    onSuccess: () => invalidateEscrows(queryClient),
  });
}

export function useReleaseEscrow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (escrowId: string) => releaseEscrowFunds(escrowId),
    onSuccess: () => invalidateEscrows(queryClient),
  });
}

export function useCancelEscrow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      escrowId,
      reason,
    }: {
      escrowId: string;
      reason?: string;
    }) => cancelEscrowFunds(escrowId, reason),
    onSuccess: () => invalidateEscrows(queryClient),
  });
}

export function useAdvertiserWallet() {
  return useQuery({
    queryKey: walletKeys.balance,
    queryFn: () => getAdvertiserWalletBalance(),
  });
}

export function usePreparePayment() {
  return useMutation({
    mutationFn: (amount: number) => prepareAdvertiserPayment(amount),
  });
}

export function usePaymentStatus(paymentId: string | null) {
  return useQuery({
    queryKey: ["payments", paymentId],
    queryFn: () => getAdvertiserPayment(paymentId!),
    enabled: Boolean(paymentId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "PAID" || status === "FAILED" || status === "CANCELED") {
        return false;
      }
      return 2000;
    },
  });
}
