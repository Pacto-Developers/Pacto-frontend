import { apiFetch } from "./client";

export type PreparePaymentRequest = {
  amount: number;
};

export type PreparePaymentResult = {
  paymentId: number;
  merchantUid: string;
  amount: number;
};

export type PaymentDetail = {
  paymentId: number;
  merchantUid: string;
  amount: number;
  status: string;
  paidAt?: string;
};

export async function preparePayment(
  token: string,
  request: PreparePaymentRequest,
): Promise<PreparePaymentResult> {
  return apiFetch<PreparePaymentResult>("/api/v1/payments/prepare", {
    method: "POST",
    token,
    body: JSON.stringify(request),
  });
}

export async function getPayment(
  token: string,
  paymentId: string | number,
): Promise<PaymentDetail> {
  return apiFetch<PaymentDetail>(`/api/v1/payments/${paymentId}`, {
    method: "GET",
    token,
  });
}
