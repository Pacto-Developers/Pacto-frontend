import { ACCESS_TOKEN_COOKIE, isAuthenticated } from "@/lib/auth";
import { getMe, isApiConfigured } from "@pacto/api-client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const authenticated = isAuthenticated(token);

  if (!authenticated) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  if (!isApiConfigured() || token === "mock") {
    return NextResponse.json({
      authenticated: true,
      user: null,
      source: "mock",
    });
  }

  try {
    const user = await getMe(token!);
    return NextResponse.json({
      authenticated: true,
      user,
      source: "api",
    });
  } catch {
    return NextResponse.json({
      authenticated: true,
      user: null,
      source: "api",
    });
  }
}
