import { bffErrorResponse, requireBffToken } from "@/lib/api/bff-route";
import { postPreparePayment } from "@/lib/api/bff-route-payment";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as { amount?: number };
  const amount = Number(body.amount);

  try {
    const result = await postPreparePayment(auth.token, amount);
    return NextResponse.json({
      data: result,
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
