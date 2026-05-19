import { NextResponse } from "next/server";
import { ROLE_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(ROLE_COOKIE);
  return response;
}
