import { bffErrorResponse, requireBffToken } from "@/lib/api/bff-route";
import {
  fetchEscrows,
  parseEscrowStatus,
} from "@/lib/api/bff-route-escrow";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const status = parseEscrowStatus(searchParams.get("status"));
  const page = Number(searchParams.get("page") ?? "1");

  try {
    const payload = await fetchEscrows(auth.token, { status, page });
    return NextResponse.json({
      data: payload.content,
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
