import { bffErrorResponse, requireBffToken } from "@/lib/api/bff-route";
import { fetchAdvertiserWallet } from "@/lib/api/bff-route-payment";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  try {
    const wallet = await fetchAdvertiserWallet(auth.token);
    return NextResponse.json({
      data: {
        balance: wallet.balance,
        lockedBalance: wallet.locked_balance,
      },
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
