import { AUTH_COOKIE, isAuthenticated } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isPublicPath(pathname: string): boolean {
  if (pathname === "/" || pathname === "/login") return true;
  if (pathname.startsWith("/api/auth")) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = isAuthenticated(
    request.cookies.get(AUTH_COOKIE)?.value,
  );

  if (isPublicPath(pathname)) {
    if (authed && pathname === "/login") {
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
