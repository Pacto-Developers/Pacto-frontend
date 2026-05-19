import { AUTH_COOKIE, isAuthenticated } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const value = cookieStore.get(AUTH_COOKIE)?.value;

  return NextResponse.json({
    authenticated: isAuthenticated(value),
  });
}
