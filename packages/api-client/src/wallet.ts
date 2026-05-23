import { apiFetch } from "./client";
import type { Paginated } from "./pagination";

export type WalletBalance = {
  wallet_id: number;
  balance: number;
  locked_balance: number;
  updated_at: string;
};

export type WalletHistoryType = "CHARGE" | "LOCK" | "RELEASE" | "REFUND";

export type WalletHistoryItem = {
  history_id: number;
  type: WalletHistoryType;
  amount: number;
  description: string;
  created_at: string;
};

export async function getWalletBalance(token: string): Promise<WalletBalance> {
  return apiFetch<WalletBalance>("/api/v1/wallets/me", { token });
}

export async function getWalletHistories(
  token: string,
  page = 1,
): Promise<Paginated<WalletHistoryItem>> {
  return apiFetch<Paginated<WalletHistoryItem>>(
    `/api/v1/wallets/me/histories?page=${page}`,
    { token },
  );
}

export type WithdrawWalletRequest = {
  amount: number;
  bank_name?: string;
  account_number?: string;
};

export type WithdrawWalletResult = {
  withdraw_id: number;
  requested_amount: number;
  remaining_balance: number;
  status: "PENDING";
};

export async function withdrawWallet(
  token: string,
  request: WithdrawWalletRequest,
): Promise<WithdrawWalletResult> {
  return apiFetch<WithdrawWalletResult>("/api/v1/wallets/withdraw", {
    method: "POST",
    token,
    body: JSON.stringify(request),
  });
}
