import "server-only";

import type { WalletHistoryItem } from "@pacto/api-client";
import { walletHistory as seedWalletHistory } from "@/lib/mock-data";

const STORE_KEY = "__pacto_mock_wallet_store__";

type MockWalletStore = {
  balance: number;
  locked_balance: number;
  histories: WalletHistoryItem[];
};

function createInitialHistories(): WalletHistoryItem[] {
  return seedWalletHistory.map((h, index) => ({
    history_id: index + 1,
    type: h.type === "withdraw" ? ("REFUND" as const) : ("RELEASE" as const),
    amount: h.amount,
    description: h.title,
    created_at: h.date,
  }));
}

function getStore(): MockWalletStore {
  const globalStore = globalThis as typeof globalThis & {
    [STORE_KEY]?: MockWalletStore;
  };

  if (!globalStore[STORE_KEY]) {
    globalStore[STORE_KEY] = {
      balance: 120_000,
      locked_balance: 50_000,
      histories: createInitialHistories(),
    };
  }

  return globalStore[STORE_KEY];
}

export function getMockWallet() {
  const store = getStore();
  return {
    balance: store.balance,
    locked_balance: store.locked_balance,
  };
}

export function getMockWalletHistories(): WalletHistoryItem[] {
  return [...getStore().histories];
}

export function applyMockWithdraw(amount: number) {
  const store = getStore();

  if (amount > store.balance) {
    return null;
  }

  store.balance -= amount;

  const withdrawId = Date.now();
  store.histories = [
    {
      history_id: withdrawId,
      type: "REFUND",
      amount: -amount,
      description: "출금 신청",
      created_at: new Date().toISOString(),
    },
    ...store.histories,
  ];

  return {
    withdraw_id: withdrawId,
    requested_amount: amount,
    remaining_balance: store.balance,
    status: "PENDING" as const,
  };
}
