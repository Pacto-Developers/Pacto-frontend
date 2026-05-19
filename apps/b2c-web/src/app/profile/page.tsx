"use client";

import { Button } from "@/components/ui/button";
import { getAppPageHeaderOffset } from "@/components/mobile/app-page-header.constants";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("pacto-splash-seen");
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-full bg-[#f2f4f6]">
      <MobileHeader title="프로필" />
      <div
        className="px-4 pb-6"
        style={{ paddingTop: getAppPageHeaderOffset() + 24 }}
      >
        <p className="text-muted-foreground">
          SNS 채널·카테고리·포트폴리오 설정.
        </p>
        <Button
          variant="outline"
          className="mt-6 w-full rounded-xl"
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      </div>
    </div>
  );
}
