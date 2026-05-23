"use client";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { WelcomeScreen } from "@/components/auth/welcome-screen";
import { BrandSplash } from "@/components/splash/brand-splash";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { LoginForm } from "./login-form";

type Phase = "loading" | "splash" | "welcome" | "login";

const WELCOME_HERO = {
  title: "Pacto에 오신 것을 환영해요",
  description: "블로거 캠페인 매칭, 거래를 약속대로",
} as const;

const LOGIN_HERO = {
  title: "로그인",
  description: "이메일과 비밀번호를 입력해 주세요",
} as const;

export function LoginPageContent() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");

  const handleSplashFinished = useCallback(() => {
    setPhase("welcome");
  }, []);

  const handleGoLogin = useCallback(() => {
    setPhase("login");
  }, []);

  const handleBackToWelcome = useCallback(() => {
    setPhase("welcome");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const res = await fetch("/api/auth/session");
      const data = (await res.json()) as { authenticated?: boolean };
      if (cancelled) return;

      if (data.authenticated) {
        router.replace("/explore");
        return;
      }

      setPhase("splash");
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (phase === "loading") {
    return (
      <AuthScreenLayout>
        <div className="flex flex-1 items-center justify-center py-24">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </AuthScreenLayout>
    );
  }

  if (phase === "splash") {
    return <BrandSplash onFinished={handleSplashFinished} />;
  }

  const hero = phase === "login" ? LOGIN_HERO : WELCOME_HERO;

  return (
    <AuthScreenLayout
      heroTitle={hero.title}
      heroDescription={hero.description}
      onBack={phase === "login" ? handleBackToWelcome : undefined}
    >
      {phase === "welcome" && <WelcomeScreen onLogin={handleGoLogin} />}

      {phase === "login" && (
        <div className="animate-in fade-in slide-in-from-right-4 fill-mode-both duration-400">
          <AuthCard>
            <Suspense
              fallback={
                <p className="py-8 text-center text-sm text-muted-foreground">
                  로딩 중…
                </p>
              }
            >
              <LoginForm />
            </Suspense>
          </AuthCard>
        </div>
      )}
    </AuthScreenLayout>
  );
}
