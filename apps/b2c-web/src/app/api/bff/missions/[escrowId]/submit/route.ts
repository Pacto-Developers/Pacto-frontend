import {
  bffErrorResponse,
  patchSubmitMission,
  requireBffToken,
} from "@/lib/api/bff-route";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ escrowId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  const { escrowId } = await context.params;
  const body = (await request.json()) as { submitted_url?: string; url?: string };
  const submittedUrl = (body.submitted_url ?? body.url)?.trim();

  if (!submittedUrl) {
    return NextResponse.json(
      { message: "submitted_url이 필요합니다." },
      { status: 400 },
    );
  }

  try {
    await patchSubmitMission(auth.token, escrowId, submittedUrl);
    return NextResponse.json({
      data: { ok: true },
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
