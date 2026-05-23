import {
  bffErrorResponse,
  fetchWalletBalance,
  requireBffToken,
} from "@/lib/api/bff-route";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  try {
    const balance = await fetchWalletBalance(auth.token);
    return NextResponse.json({
      data: {
        balance: balance.balance,
        lockedBalance: balance.locked_balance,
      },
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
