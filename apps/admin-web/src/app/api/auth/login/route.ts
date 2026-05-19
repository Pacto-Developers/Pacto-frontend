import { getHomePathForRole } from "@pacto/auth";
import type { Role } from "@pacto/types";
import { NextResponse } from "next/server";
import { isValidRole, ROLE_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { role?: string };
  const role = body.role;

  if (!isValidRole(role)) {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  const response = NextResponse.json({
    ok: true,
    redirect: getHomePathForRole(role as Role),
  });

  response.cookies.set(ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
