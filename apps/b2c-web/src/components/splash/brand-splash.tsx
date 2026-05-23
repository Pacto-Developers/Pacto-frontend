"use client";

import { PactoBrand } from "@/components/brand/pacto-brand";
import { APP_BG } from "@/components/auth/auth-screen-layout";
import { mobileShellClass } from "@/lib/mobile-layout";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const HOLD_MS = 1200;
const EXIT_MS = 400;

type Phase = "enter" | "hold" | "exit";

type BrandSplashProps = {
  onFinished: () => void;
};

/** 토스·카카오식 브랜드 스플래시 — 폼 없이 로고·태그라인만 */
export function BrandSplash({ onFinished }: BrandSplashProps) {
  const onFinishedRef = useRef(onFinished);
  const [phase, setPhase] = useState<Phase>("enter");
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    let cancelled = false;
    const timeouts: number[] = [];
    let raf1 = 0;
    let raf2 = 0;

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        setPhase("hold");
      });
    });

    timeouts.push(
      window.setTimeout(() => {
        if (cancelled) return;
        setPhase("exit");
        setLeaving(true);
      }, HOLD_MS),
    );

    timeouts.push(
      window.setTimeout(() => {
        if (cancelled) return;
        onFinishedRef.current();
      }, HOLD_MS + EXIT_MS),
    );

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col",
        APP_BG,
        "transition-opacity duration-400 ease-out",
        leaving && "opacity-0",
      )}
    >
      <div
        className={cn(
          mobileShellClass,
          "relative mx-auto flex h-full w-full flex-col items-center justify-center px-6",
          "pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute left-1/2 top-[45%] size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl transition-all duration-700",
            phase === "enter" ? "scale-75 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <div
          className={cn(
            "relative z-10 flex flex-col items-center gap-4 transition-all duration-700 ease-out",
            phase === "enter" && "scale-95 opacity-0",
            phase === "hold" && "scale-100 opacity-100",
            phase === "exit" && "scale-[1.02] opacity-0",
          )}
        >
          <PactoBrand size="lg" priority />
          <p className="text-sm text-muted-foreground">거래를 약속대로</p>
        </div>
      </div>
    </div>
  );
}
