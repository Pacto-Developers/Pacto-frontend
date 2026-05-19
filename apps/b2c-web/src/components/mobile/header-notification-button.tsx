"use client";

import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import Link from "next/link";

type HeaderNotificationButtonProps = {
  count?: number;
  className?: string;
};

export function HeaderNotificationButton({
  count = 0,
  className,
}: HeaderNotificationButtonProps) {
  const hasUnread = count > 0;

  return (
    <Link
      href="/messages"
      aria-label={hasUnread ? `알림 ${count}건` : "알림"}
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-sm transition-colors hover:bg-white/90 active:scale-95",
        className,
      )}
    >
      <Bell className="size-5" strokeWidth={2} />
      {hasUnread && (
        <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 py-0.5 text-[10px] font-bold leading-none text-primary-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
