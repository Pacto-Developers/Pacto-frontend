import {
  bffErrorResponse,
  postWithdrawWallet,
  requireBffToken,
} from "@/lib/api/bff-route";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as {
    amount?: number;
    bank_name?: string;
    account_number?: string;
  };

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { message: "출금 금액을 입력해 주세요." },
      { status: 400 },
    );
  }

  try {
    const result = await postWithdrawWallet(auth.token, {
      amount,
      bank_name: body.bank_name?.trim() || undefined,
      account_number: body.account_number?.trim() || undefined,
    });

    return NextResponse.json({
      data: {
        withdrawId: result.withdraw_id,
        requestedAmount: result.requested_amount,
        remainingBalance: result.remaining_balance,
        status: result.status,
      },
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
