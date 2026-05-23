import {
  bffErrorResponse,
  postAcceptMission,
  requireBffToken,
} from "@/lib/api/bff-route";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as { campaignId?: string };
  const campaignId = body.campaignId?.trim();

  if (!campaignId) {
    return NextResponse.json(
      { message: "campaignId가 필요합니다." },
      { status: 400 },
    );
  }

  try {
    await postAcceptMission(auth.token, campaignId);
    return NextResponse.json({
      data: { ok: true },
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
