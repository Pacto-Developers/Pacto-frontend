import { getHomePathForRole } from "@pacto/auth";
import {
  ApiClientError,
  isApiConfigured,
  login,
} from "@pacto/api-client";
import type { Role } from "@pacto/types";
import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessTokenCookieOptions,
  isValidRole,
  refreshTokenCookieOptions,
  ROLE_COOKIE,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    role?: string;
    email?: string;
    password?: string;
  };
  const role = body.role;

  if (!isValidRole(role)) {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password ?? "";

  // 광고주: 실 API 로그인 (BUSINESS)
  if (role === "advertiser" && isApiConfigured()) {
    if (!email || !email.includes("@") || password.length < 4) {
      return NextResponse.json(
        { message: "광고주 로그인에는 이메일과 비밀번호(4자 이상)가 필요합니다." },
        { status: 400 },
      );
    }

    try {
      const result = await login({ email, password });

      if (result.role !== "BUSINESS") {
        return NextResponse.json(
          {
            message:
              "광고주(BUSINESS) 계정만 관리자에 로그인할 수 있습니다.",
          },
          { status: 403 },
        );
      }

      const response = NextResponse.json({
        ok: true,
        redirect: getHomePathForRole(role as Role),
        source: "api",
      });

      response.cookies.set(ROLE_COOKIE, role, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.set(
        ACCESS_TOKEN_COOKIE,
        result.accessToken,
        accessTokenCookieOptions,
      );
      response.cookies.set(
        REFRESH_TOKEN_COOKIE,
        result.refreshToken,
        refreshTokenCookieOptions,
      );

      return response;
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : "로그인에 실패했습니다.";
      const status = error instanceof ApiClientError ? error.status : 401;
      return NextResponse.json(
        { message },
        { status: status >= 400 ? status : 401 },
      );
    }
  }

  // 대행사: API Role 없음 → 데모 쿠키만 (추후 API 연동)
  if (role === "agency" && isApiConfigured() && email && password.length >= 4) {
    return NextResponse.json(
      {
        message:
          "대행사(agency) 계정 API는 아직 없습니다. Role만 선택해 데모로 입장하거나 이메일·비밀번호 없이 입장하세요.",
      },
      { status: 501 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    redirect: getHomePathForRole(role as Role),
    source: isApiConfigured() ? "demo" : "mock",
  });

  response.cookies.set(ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  if (!isApiConfigured()) {
    response.cookies.set(ACCESS_TOKEN_COOKIE, "mock", accessTokenCookieOptions);
  }

  return response;
}
