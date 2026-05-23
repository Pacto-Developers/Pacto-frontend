"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAppPageHeaderOffset } from "@/components/mobile/app-page-header.constants";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { useMe } from "@/lib/api/hooks";
import { isBloggerUser } from "@/lib/api/user";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProfileContent() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useMe();
  const user = data?.user ?? null;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-full bg-[#f2f4f6]">
      <MobileHeader title="프로필" />
      <div
        className="space-y-4 px-4 pb-6"
        style={{ paddingTop: getAppPageHeaderOffset() + 24 }}
      >
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <Card className="rounded-2xl border-0 shadow-none ring-0">
            <CardContent className="space-y-3 px-5 py-5">
              <p className="text-sm text-destructive">
                {error instanceof Error
                  ? error.message
                  : "프로필을 불러오지 못했습니다."}
              </p>
              <Button variant="outline" className="w-full" onClick={() => refetch()}>
                다시 시도
              </Button>
            </CardContent>
          </Card>
        ) : user ? (
          <Card className="rounded-2xl border-0 shadow-none ring-0">
            <CardContent className="space-y-4 px-5 py-5">
              <div>
                <p className="text-xs text-muted-foreground">닉네임</p>
                <p className="text-lg font-semibold">
                  {isBloggerUser(user) ? user.nickname : user.companyName}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">이메일</p>
                <p className="font-medium">{user.email}</p>
              </div>
              {isBloggerUser(user) ? (
                <div>
                  <p className="text-xs text-muted-foreground">블로그</p>
                  <a
                    href={user.blogUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {user.blogUrl}
                  </a>
                </div>
              ) : null}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">역할</span>
                <span className="font-medium">{user.role}</span>
              </div>
              {data?.source === "mock" ? (
                <p className="text-xs text-muted-foreground">
                  데모 프로필 · API 연결 시 실제 계정 정보가 표시됩니다.
                </p>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <p className="text-sm text-muted-foreground">
            로그인 정보를 찾을 수 없습니다.
          </p>
        )}

        <Card className="rounded-2xl border-0 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ring-0">
          <CardContent className="divide-y divide-foreground/5 px-0 py-0">
            <a
              href="#"
              className="flex px-5 py-3.5 text-sm text-foreground hover:bg-foreground/[0.02]"
            >
              이용약관
            </a>
            <a
              href="#"
              className="flex px-5 py-3.5 text-sm text-foreground hover:bg-foreground/[0.02]"
            >
              개인정보 처리방침
            </a>
            <a
              href="mailto:support@pacto.app"
              className="flex px-5 py-3.5 text-sm text-foreground hover:bg-foreground/[0.02]"
            >
              고객센터 문의
            </a>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Pacto 블로거 앱 · v0.1
        </p>

        <Button
          variant="outline"
          className="w-full rounded-xl"
          onClick={handleLogout}
        >
          로그아웃
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/login" className="underline-offset-4 hover:underline">
            다른 계정으로 로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
