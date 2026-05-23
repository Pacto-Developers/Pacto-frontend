import { bffErrorResponse, requireBffToken } from "@/lib/api/bff-route";
import { postCancelEscrow } from "@/lib/api/bff-route-escrow";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ escrowId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  const { escrowId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { reason?: string };

  try {
    const result = await postCancelEscrow(
      auth.token,
      escrowId,
      body.reason?.trim(),
    );
    return NextResponse.json({
      data: result,
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
