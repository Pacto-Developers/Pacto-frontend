import { ACCESS_TOKEN_COOKIE, isAuthenticated } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authEntryPaths = ["/login", "/signup"] as const;

function isPublicPath(pathname: string): boolean {
  if (pathname === "/" || authEntryPaths.includes(pathname as "/login" | "/signup")) {
    return true;
  }
  if (pathname.startsWith("/api/auth")) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = isAuthenticated(
    request.cookies.get(ACCESS_TOKEN_COOKIE)?.value,
  );

  if (isPublicPath(pathname)) {
    if (
      authed &&
      authEntryPaths.includes(pathname as (typeof authEntryPaths)[number])
    ) {
      return NextResponse.redirect(new URL("/explore", request.url));
    }
    return NextResponse.next();
  }

  if (!authed) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
