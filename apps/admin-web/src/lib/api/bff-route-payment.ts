import "server-only";

import {
  ApiClientError,
  getPayment as getPaymentApi,
  getWalletBalance as getWalletBalanceApi,
  preparePayment as preparePaymentApi,
  type PaymentDetail,
} from "@pacto/api-client";
import { isMockToken } from "./bff-route";

let mockAdvertiserBalance = 2_500_000;
let mockLockedBalance = 500_000;
let mockPaymentSeq = 1;

const mockPayments = new Map<number, PaymentDetail>();

export async function fetchAdvertiserWallet(token: string) {
  if (isMockToken(token)) {
    return {
      wallet_id: 0,
      balance: mockAdvertiserBalance,
      locked_balance: mockLockedBalance,
      updated_at: new Date().toISOString(),
    };
  }

  return getWalletBalanceApi(token);
}

export async function postPreparePayment(token: string, amount: number) {
  if (amount <= 0) {
    throw new ApiClientError(400, "유효하지 않은 결제 금액입니다.");
  }

  if (isMockToken(token)) {
    const paymentId = mockPaymentSeq++;
    const merchantUid = `ORDER_MOCK_${Date.now()}_${paymentId}`;
    mockPayments.set(paymentId, {
      paymentId,
      merchantUid,
      amount,
      status: "READY",
    });
    return { paymentId, merchantUid, amount };
  }

  return preparePaymentApi(token, { amount });
}

export async function fetchPayment(token: string, paymentId: string) {
  if (isMockToken(token)) {
    const id = Number(paymentId);
    const payment = mockPayments.get(id);
    if (!payment) {
      throw new ApiClientError(404, "결제 정보를 찾을 수 없습니다.");
    }
    return payment;
  }

  return getPaymentApi(token, paymentId);
}

/** mock: PortOne 없이 결제 완료 처리 */
export function completeMockPayment(paymentId: number) {
  const payment = mockPayments.get(paymentId);
  if (!payment) {
    throw new ApiClientError(404, "결제 정보를 찾을 수 없습니다.");
  }
  if (payment.status === "PAID") return payment;

  payment.status = "PAID";
  payment.paidAt = new Date().toISOString();
  mockAdvertiserBalance += payment.amount;
  mockPayments.set(paymentId, payment);
  return payment;
}
