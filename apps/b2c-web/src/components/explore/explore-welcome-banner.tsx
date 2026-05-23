"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ExploreWelcomeBanner() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("welcome") === "1") {
      setVisible(true);
    }
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div className="relative rounded-2xl bg-primary px-4 py-4 text-primary-foreground shadow-[0_4px_20px_rgba(49,130,246,0.25)]">
      <button
        type="button"
        className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/15"
        aria-label="닫기"
        onClick={() => setVisible(false)}
      >
        <X className="size-4" />
      </button>
      <p className="pr-8 text-sm font-semibold">가입을 환영해요!</p>
      <p className="mt-1 text-xs text-primary-foreground/85">
        마음에 드는 캠페인을 골라 미션을 수락해 보세요.
      </p>
      <Link href="/missions" className="mt-3 inline-block">
        <Button
          size="sm"
          variant="secondary"
          className="rounded-lg bg-white text-primary hover:bg-white/90"
        >
          내 미션 보기
        </Button>
      </Link>
    </div>
  );
}
