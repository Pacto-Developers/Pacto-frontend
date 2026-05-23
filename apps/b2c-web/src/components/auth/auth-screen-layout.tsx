import { PactoBrand } from "@/components/brand/pacto-brand";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

const APP_BG = "bg-[#f2f4f6]";

type AuthScreenLayoutProps = {
  children: ReactNode;
  className?: string;
  /** 로그인 카드 위 히어로 문구 */
  heroTitle?: string;
  heroDescription?: string;
  onBack?: () => void;
};

export function AuthScreenLayout({
  children,
  className,
  heroTitle,
  heroDescription,
  onBack,
}: AuthScreenLayoutProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-dvh flex-col",
        APP_BG,
        "px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]",
        className,
      )}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-2 -ml-1 flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
          aria-label="이전"
        >
          <ChevronLeft className="size-6" />
        </button>
      )}
      <header
        className={cn(
          "mb-6 flex flex-col items-center gap-3 text-center",
          onBack && "mb-4",
        )}
      >
        <PactoBrand size="lg" priority />
        {(heroTitle || heroDescription) && (
          <div className="space-y-1">
            {heroTitle && (
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                {heroTitle}
              </h1>
            )}
            {heroDescription && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {heroDescription}
              </p>
            )}
          </div>
        )}
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}

export { APP_BG };
