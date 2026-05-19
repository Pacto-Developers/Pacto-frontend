"use client";

import { PactoBrand } from "@/components/brand/pacto-brand";
import { HeaderNotificationButton } from "@/components/mobile/header-notification-button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import {
  APP_PAGE_HEADER_HEIGHT,
  APP_PAGE_SECONDARY_HEIGHT,
} from "./app-page-header.constants";

export {
  APP_PAGE_HEADER_HEIGHT,
  APP_PAGE_SECONDARY_HEIGHT,
  getAppPageHeaderOffset,
} from "./app-page-header.constants";

type AppPageHeaderProps = {
  title: string;
  variant?: "main" | "sub";
  backHref?: string;
  brandHref?: string;
  showNotification?: boolean;
  notificationCount?: number;
  /** 탐색 필터 바 등 두 번째 줄 */
  secondary?: React.ReactNode;
  className?: string;
};

export function AppPageHeader({
  title,
  variant = "main",
  backHref = "/explore",
  brandHref = "/explore",
  showNotification = true,
  notificationCount = 2,
  secondary,
  className,
}: AppPageHeaderProps) {
  return (
    <div
      className={cn(
        "fixed top-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2",
        className,
      )}
    >
      <header className="relative flex h-14 items-center bg-white px-4">
        {variant === "sub" ? (
          <Link
            href={backHref}
            aria-label="뒤로 가기"
            className="relative z-10 -ml-1 flex size-10 shrink-0 items-center justify-center text-muted-foreground transition-opacity hover:opacity-80"
          >
            <ChevronLeft className="size-6" />
          </Link>
        ) : (
          <PactoBrand
            size="sm"
            href={brandHref}
            showTagline={false}
            className="relative z-10 min-w-0"
          />
        )}

        <h1 className="pointer-events-none absolute inset-0 flex items-center justify-center text-xl font-bold text-primary">
          {title}
        </h1>

        {showNotification ? (
          <HeaderNotificationButton
            count={notificationCount}
            className="relative z-10 ml-auto size-10 bg-transparent shadow-none ring-0 hover:bg-transparent"
          />
        ) : (
          <span className="relative z-10 ml-auto size-10 shrink-0" />
        )}
      </header>

      {secondary ? (
        <AppPageHeaderSecondary>{secondary}</AppPageHeaderSecondary>
      ) : null}
    </div>
  );
}

export function AppPageHeaderSecondary({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-12 items-center border-b border-[#e0e3e5] bg-white px-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

