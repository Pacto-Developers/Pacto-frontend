import { bffErrorResponse, requireBffToken } from "@/lib/api/bff-route";
import {
  completeMockPayment,
  fetchPayment,
} from "@/lib/api/bff-route-payment";
import { isApiConfigured } from "@pacto/api-client";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ paymentId: string }> };

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  const { paymentId } = await context.params;
  const { searchParams } = new URL(request.url);
  const mockComplete = searchParams.get("mockComplete") === "1";

  try {
    if (
      mockComplete &&
      (auth.token === "mock" || !isApiConfigured())
    ) {
      const payment = completeMockPayment(Number(paymentId));
      return NextResponse.json({ data: payment, source: "mock" });
    }

    const payment = await fetchPayment(auth.token, paymentId);
    return NextResponse.json({
      data: payment,
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
