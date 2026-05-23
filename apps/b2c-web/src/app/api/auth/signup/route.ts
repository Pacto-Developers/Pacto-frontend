import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "@/lib/auth";
import {
  ApiClientError,
  isApiConfigured,
  login,
  signupBlogger,
} from "@pacto/api-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    nickname?: string;
    blogUrl?: string;
  };

  const email = body.email?.trim();
  const password = body.password ?? "";
  const nickname = body.nickname?.trim();
  const blogUrl = body.blogUrl?.trim();

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { message: "올바른 이메일을 입력해 주세요." },
      { status: 400 },
    );
  }

  if (password.length < 4) {
    return NextResponse.json(
      { message: "비밀번호는 4자 이상이어야 합니다." },
      { status: 400 },
    );
  }

  if (!nickname) {
    return NextResponse.json(
      { message: "닉네임을 입력해 주세요." },
      { status: 400 },
    );
  }

  if (!blogUrl) {
    return NextResponse.json(
      { message: "블로그 URL을 입력해 주세요." },
      { status: 400 },
    );
  }

  try {
    new URL(blogUrl);
  } catch {
    return NextResponse.json(
      { message: "올바른 블로그 URL을 입력해 주세요. (https://…)" },
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
    await signupBlogger({
      email,
      password,
      role: "BLOGGER",
      nickname,
      blogUrl,
    });

    const result = await login({ email, password });

    if (result.role !== "BLOGGER") {
      return NextResponse.json(
        {
          message:
            "가입은 완료되었으나 블로거 계정으로 로그인할 수 없습니다. 로그인 화면에서 다시 시도해 주세요.",
          redirect: "/login",
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
        : "회원가입에 실패했습니다.";
    const status = error instanceof ApiClientError ? error.status : 400;
    return NextResponse.json(
      { message },
      { status: status >= 400 ? status : 400 },
    );
  }
}
