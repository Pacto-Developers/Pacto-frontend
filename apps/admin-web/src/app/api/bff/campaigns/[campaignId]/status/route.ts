import {
  bffErrorResponse,
  patchCampaignStatus,
  requireBffToken,
} from "@/lib/api/bff-route";
import type { CampaignStatus } from "@pacto/api-client";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ campaignId: string }>;
};

const ALLOWED: CampaignStatus[] = ["OPEN", "CLOSED", "CANCELED"];

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  const { campaignId } = await context.params;
  const body = (await request.json()) as { status?: string };
  const status = body.status as CampaignStatus;

  if (!ALLOWED.includes(status)) {
    return NextResponse.json(
      { message: "유효하지 않은 상태 값입니다." },
      { status: 400 },
    );
  }

  try {
    const result = await patchCampaignStatus(auth.token, campaignId, status);
    return NextResponse.json({
      data: result,
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
