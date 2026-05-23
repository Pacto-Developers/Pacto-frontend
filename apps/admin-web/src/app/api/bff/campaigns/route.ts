import {
  bffErrorResponse,
  fetchCampaigns,
  postCreateCampaign,
  requireBffToken,
} from "@/lib/api/bff-route";
import type { CampaignStatus } from "@pacto/api-client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as CampaignStatus | null;
  const page = Number(searchParams.get("page") ?? "0");
  const size = Number(searchParams.get("size") ?? "20");

  try {
    const payload = await fetchCampaigns(auth.token, {
      status: status ?? undefined,
      page,
      size,
    });

    return NextResponse.json({
      data: payload.content,
      meta: {
        page: payload.page,
        size: payload.size,
        totalElements: payload.total_elements,
        totalPages: payload.total_pages,
      },
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as {
    title?: string;
    description?: string;
    category?: string;
    reward_point?: number;
    total_slots?: number;
    deadline?: string;
    requirements?: string[];
  };

  const title = body.title?.trim();
  const description = body.description?.trim();
  const category = body.category?.trim();
  const reward_point = Number(body.reward_point);
  const total_slots = Number(body.total_slots);
  const deadline = body.deadline?.trim();

  if (!title || !description || !category) {
    return NextResponse.json(
      { message: "제목, 설명, 카테고리는 필수입니다." },
      { status: 400 },
    );
  }

  if (!Number.isFinite(reward_point) || reward_point <= 0) {
    return NextResponse.json(
      { message: "보상 포인트를 확인해 주세요." },
      { status: 400 },
    );
  }

  if (!Number.isFinite(total_slots) || total_slots <= 0) {
    return NextResponse.json(
      { message: "모집 인원을 확인해 주세요." },
      { status: 400 },
    );
  }

  if (!deadline) {
    return NextResponse.json(
      { message: "마감 일시를 입력해 주세요." },
      { status: 400 },
    );
  }

  try {
    const result = await postCreateCampaign(auth.token, {
      title,
      description,
      category,
      reward_point,
      total_slots,
      deadline,
      requirements: body.requirements,
    });

    return NextResponse.json({
      data: result,
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
