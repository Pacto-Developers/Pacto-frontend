"use client";

import type {
  AppNotification,
  NotificationType,
} from "@/lib/mock-notifications";
import { cn } from "@/lib/utils";
import {
  Bell,
  ClipboardCheck,
  Compass,
  Sparkles,
  Wallet,
} from "lucide-react";
import Link from "next/link";

const iconMap: Record<
  NotificationType,
  { icon: typeof Bell; className: string }
> = {
  settlement: { icon: Wallet, className: "bg-emerald-500/15 text-emerald-600" },
  mission: {
    icon: ClipboardCheck,
    className: "bg-primary/10 text-primary",
  },
  campaign: { icon: Compass, className: "bg-violet-500/15 text-violet-600" },
  withdraw: { icon: Wallet, className: "bg-amber-500/15 text-amber-700" },
  system: { icon: Sparkles, className: "bg-foreground/8 text-muted-foreground" },
};

type NotificationsListProps = {
  items: AppNotification[];
  onItemClick?: (item: AppNotification) => void;
  compact?: boolean;
};

export function NotificationsList({
  items,
  onItemClick,
  compact = false,
}: NotificationsListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Bell className="mb-3 size-10 text-muted-foreground/40" />
        <p className="font-medium text-foreground">새 알림이 없어요</p>
        <p className="mt-1 text-sm text-muted-foreground">
          정산·미션 소식이 오면 여기에 표시돼요
        </p>
      </div>
    );
  }

  return (
    <ul className={cn("divide-y divide-foreground/5", compact && "px-0")}>
      {items.map((item) => {
        const { icon: Icon, className: iconClass } = iconMap[item.type];
        const content = (
          <>
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                iconClass,
              )}
            >
              <Icon className="size-5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <p
                  className={cn(
                    "text-sm leading-snug",
                    item.read ? "font-medium text-foreground" : "font-semibold",
                  )}
                >
                  {item.title}
                </p>
                {!item.read ? (
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                ) : null}
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {item.body}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground/80">
                {item.time}
              </p>
            </div>
          </>
        );

        const rowClass = cn(
          "flex w-full gap-3 px-4 py-3.5 text-left transition-colors",
          !item.read && "bg-primary/[0.03]",
          item.href && "hover:bg-foreground/[0.02]",
        );

        if (item.href) {
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={rowClass}
                onClick={() => onItemClick?.(item)}
              >
                {content}
              </Link>
            </li>
          );
        }

        return (
          <li key={item.id}>
            <button
              type="button"
              className={rowClass}
              onClick={() => onItemClick?.(item)}
            >
              {content}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
