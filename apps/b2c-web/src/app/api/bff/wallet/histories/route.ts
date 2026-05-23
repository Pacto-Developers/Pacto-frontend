import { mapApiWalletHistory } from "@/lib/api/mappers";
import {
  bffErrorResponse,
  fetchWalletHistories,
  requireBffToken,
} from "@/lib/api/bff-route";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auth = await requireBffToken();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");

  try {
    const payload = await fetchWalletHistories(auth.token, page);
    const histories = payload.content.map((item, index) =>
      mapApiWalletHistory({
        id: item.history_id ? item.history_id : `history-${index}`,
        historyId: item.history_id,
        type: item.type,
        amount: item.amount,
        description: item.description,
        createdAt: item.created_at,
      }),
    );

    return NextResponse.json({
      data: histories,
      source: auth.token === "mock" ? "mock" : "api",
    });
  } catch (error) {
    return bffErrorResponse(error);
  }
}
