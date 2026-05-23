import { bffErrorResponse, requireBffToken } from "@/lib/api/bff-route";
import { patchCancelMission } from "@/lib/api/bff-route-escrow";
import type { MissionCancelReason } from "@pacto/api-client";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ escrowId: string }> };

const REASONS: MissionCancelReason[] = [
  "DEADLINE_EXCEEDED",
  "BLOGGER_REQUEST",
  "ADVERTISER_REJECT",
];

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  const { escrowId } = await context.params;
  const body = (await request.json()) as { reason?: string };
  const reason = body.reason as MissionCancelReason;

  if (!REASONS.includes(reason)) {
    return NextResponse.json(
      { message: "취소 사유를 선택해 주세요." },
      { status: 400 },
    );
  }

  try {
    const result = await patchCancelMission(auth.token, escrowId, reason);
    return NextResponse.json({
      data: result,
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
