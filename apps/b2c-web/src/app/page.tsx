"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** 루트 → 로그인 또는 탐색으로 위임 (스플래시는 /login에서 표시) */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function redirect() {
      const res = await fetch("/api/auth/session");
      const data = (await res.json()) as { authenticated?: boolean };
      if (cancelled) return;
      router.replace(data.authenticated ? "/explore" : "/login");
    }

    void redirect();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return <div className="min-h-dvh bg-[#e5e8eb]" />;
}
