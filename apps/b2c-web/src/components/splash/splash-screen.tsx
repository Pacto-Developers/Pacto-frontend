"use client";

import { PactoBrand } from "@/components/brand/pacto-brand";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SPLASH_KEY = "pacto-splash-seen";

type Phase = "enter" | "hold" | "exit";

export function SplashScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("enter");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    async function goNext() {
      const res = await fetch("/api/auth/session");
      const data = (await res.json()) as { authenticated?: boolean };
      if (cancelled) return;
      router.replace(data.authenticated ? "/explore" : "/login");
    }

    async function init() {
      const res = await fetch("/api/auth/session");
      const data = (await res.json()) as { authenticated?: boolean };
      if (cancelled) return;

      if (data.authenticated) {
        router.replace("/explore");
        return;
      }

      if (localStorage.getItem(SPLASH_KEY) === "1") {
        router.replace("/login");
        return;
      }

      setReady(true);
      timers.push(window.setTimeout(() => setPhase("hold"), 400));
      timers.push(window.setTimeout(() => setPhase("exit"), 2200));
      timers.push(
        window.setTimeout(() => {
          localStorage.setItem(SPLASH_KEY, "1");
          void goNext();
        }, 2800),
      );
    }

    void init();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [router]);

  if (!ready) {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] transition-opacity duration-500",
        phase === "exit" && "opacity-0",
      )}
    >
      <div
        className={cn(
          "absolute size-48 rounded-full bg-primary/20 blur-3xl transition-all duration-700",
          phase === "enter" ? "scale-50 opacity-0" : "scale-100 opacity-100",
        )}
      />
      <div
        className={cn(
          "relative z-10 transition-all duration-700 ease-out",
          phase === "enter" && "scale-75 opacity-0",
          phase === "hold" && "scale-100 opacity-100",
          phase === "exit" && "scale-105 opacity-0",
        )}
      >
        <PactoBrand
          size="lg"
          inverted
          priority
          className="drop-shadow-[0_0_24px_rgba(49,130,246,0.35)] [&_span:first-of-type]:!text-3xl"
        />
      </div>
    </div>
  );
}
