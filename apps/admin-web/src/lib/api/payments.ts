import type { PaymentDetail, PreparePaymentResult } from "@pacto/api-client";
import { bffRequest } from "./bff";

export async function prepareAdvertiserPayment(amount: number) {
  return bffRequest<PreparePaymentResult>("/api/bff/payments/prepare", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export async function getAdvertiserPayment(
  paymentId: string,
  mockComplete = false,
) {
  const query = mockComplete ? "?mockComplete=1" : "";
  return bffRequest<PaymentDetail>(
    `/api/bff/payments/${paymentId}${query}`,
  );
}

export async function getAdvertiserWalletBalance() {
  return bffRequest<{ balance: number; lockedBalance: number }>(
    "/api/bff/wallet/balance",
  );
}
