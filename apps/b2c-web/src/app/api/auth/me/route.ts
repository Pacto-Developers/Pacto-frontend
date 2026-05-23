import { getServerAccessToken } from "@/lib/auth-server";
import { ApiClientError, getMe, isApiConfigured } from "@pacto/api-client";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getServerAccessToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!isApiConfigured() || token === "mock") {
    return NextResponse.json({
      user: {
        id: 1,
        email: "blogger@demo.pacto",
        role: "BLOGGER",
        nickname: "데모 블로거",
        blogUrl: "https://blog.example.com",
      },
      source: "mock",
    });
  }

  try {
    const user = await getMe(token);
    return NextResponse.json({ user, source: "api" });
  } catch (error) {
    const message =
      error instanceof ApiClientError ? error.message : "Unauthorized";
    const status = error instanceof ApiClientError ? error.status : 401;
    return NextResponse.json({ message }, { status });
  }
}
