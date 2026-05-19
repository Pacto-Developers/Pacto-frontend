import { canAccessRoute } from "@pacto/auth";
import { getHomePathForRole } from "@pacto/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseRole, ROLE_COOKIE } from "@/lib/auth";

const publicPaths = ["/login", "/api/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = parseRole(request.cookies.get(ROLE_COOKIE)?.value);

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    if (role && pathname === "/login") {
      return NextResponse.redirect(
        new URL(getHomePathForRole(role), request.url),
      );
    }
    return NextResponse.next();
  }

  if (!role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!canAccessRoute(role, pathname)) {
    return NextResponse.redirect(
      new URL(getHomePathForRole(role), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
