import { AUTH_COOKIE } from "@/lib/auth";
import { loginWithApi } from "@/lib/api/services";
import { isApiConfigured } from "@pacto/api-client";
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

  if (isApiConfigured()) {
    const apiResult = await loginWithApi(email, password);
    if (!apiResult) {
      return NextResponse.json(
        { message: "로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      ok: true,
      redirect: "/explore",
      source: "api",
    });

    const token = apiResult.accessToken ?? apiResult.token;
    if (token) {
      response.cookies.set(AUTH_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    } else {
      response.cookies.set(AUTH_COOKIE, "1", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  }

  const response = NextResponse.json({
    ok: true,
    redirect: "/explore",
    source: "mock",
  });

  response.cookies.set(AUTH_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
