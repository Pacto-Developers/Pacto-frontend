"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Compass, ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: Compass,
    title: "맞는 캠페인 찾기",
    description: "카테고리·조건에 맞는 브랜드 캠페인을 탐색해요",
  },
  {
    icon: ShieldCheck,
    title: "에스크로로 안전하게",
    description: "약속한 대로 진행되면 정산, 걱정 없이 협업해요",
  },
  {
    icon: Wallet,
    title: "수익은 한곳에서",
    description: "지갑에서 잔액·출금 내역을 바로 확인해요",
  },
] as const;

type WelcomeScreenProps = {
  onLogin: () => void;
  className?: string;
};

/**
 * 인스타그램·토스식 웰컴 — 가치 제안 후 사용자가 로그인을 선택
 * (로그인 폼을 바로 노출하지 않음)
 */
export function WelcomeScreen({ onLogin, className }: WelcomeScreenProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500",
        className,
      )}
    >
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <p className="mb-4 text-center text-[15px] font-semibold leading-snug text-foreground">
          블로거를 위한
          <br />
          캠페인 매칭 플랫폼
        </p>
        <ul className="space-y-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" strokeWidth={2} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto space-y-3 pt-2">
        <Button
          type="button"
          onClick={onLogin}
          className="h-12 w-full rounded-xl bg-primary text-base font-semibold shadow-[0_4px_14px_rgba(49,130,246,0.35)] hover:bg-primary/90"
          size="lg"
        >
          로그인하기
        </Button>
        <Link
          href="/signup"
          className="flex h-12 w-full items-center justify-center rounded-xl border border-foreground/10 bg-white text-base font-medium text-foreground transition-colors hover:bg-white/90"
        >
          회원가입
        </Link>
        <p className="pb-1 text-center text-xs text-muted-foreground">
          가입 후 바로 캠페인 탐색을 시작할 수 있어요
        </p>
      </div>
    </div>
  );
}
