import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "@/lib/auth";
import { ApiClientError, isApiConfigured, login } from "@pacto/api-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim();
  const password = body.password ?? "";

  if (!email || !email.includes("@") || password.length < 4) {
    return NextResponse.json(
      { message: "이메일과 비밀번호(4자 이상)를 확인해 주세요." },
      { status: 400 },
    );
  }

  if (!isApiConfigured()) {
    const response = NextResponse.json({
      ok: true,
      redirect: "/explore",
      source: "mock",
    });
    response.cookies.set(ACCESS_TOKEN_COOKIE, "mock", accessTokenCookieOptions);
    return response;
  }

  try {
    const result = await login({ email, password });

    if (result.role !== "BLOGGER") {
      return NextResponse.json(
        {
          message:
            "블로거 계정으로만 로그인할 수 있습니다. 광고주는 관리자 앱을 이용해 주세요.",
        },
        { status: 403 },
      );
    }

    const response = NextResponse.json({
      ok: true,
      redirect: "/explore",
      source: "api",
      role: result.role,
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
        : "로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.";
    const status = error instanceof ApiClientError ? error.status : 401;
    return NextResponse.json(
      { message },
      { status: status >= 400 ? status : 401 },
    );
  }
}
