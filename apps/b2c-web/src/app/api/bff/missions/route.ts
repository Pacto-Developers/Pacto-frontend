import { mapApiMission } from "@/lib/api/mappers";
import { missions as mockMissions } from "@/lib/mock-data";
import {
  bffErrorResponse,
  fetchMyMissions,
  isMockToken,
  parseMissionStatus,
  requireBffToken,
} from "@/lib/api/bff-route";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  if (isMockToken(auth.token)) {
    return NextResponse.json({ data: mockMissions, source: "mock" });
  }

  const { searchParams } = new URL(request.url);
  const status = parseMissionStatus(searchParams.get("status"));
  const page = Number(searchParams.get("page") ?? "0");
  const size = Number(searchParams.get("size") ?? "10");

  try {
    const payload = await fetchMyMissions(auth.token, { status, page, size });
    const missions = payload.content.map((item) =>
      mapApiMission({
        escrowId: item.escrow_id,
        campaignTitle: item.campaign_title,
        rewardPoint: item.reward_point,
        status: item.status,
        deadline: item.deadline,
        submittedUrl: item.submitted_url,
      }),
    );

    return NextResponse.json({ data: missions, source: "api" });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
