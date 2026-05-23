import { bffErrorResponse, requireBffToken } from "@/lib/api/bff-route";
import { postReleaseEscrow } from "@/lib/api/bff-route-escrow";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ escrowId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  const { escrowId } = await context.params;

  try {
    const result = await postReleaseEscrow(auth.token, escrowId);
    return NextResponse.json({
      data: result,
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
