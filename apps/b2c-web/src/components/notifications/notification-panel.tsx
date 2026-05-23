"use client";

import { NotificationsList } from "@/components/notifications/notifications-list";
import { useNotifications } from "@/components/notifications/notification-context";
import { APP_PAGE_HEADER_HEIGHT } from "@/components/mobile/app-page-header.constants";
import { mobileFixedClass } from "@/lib/mobile-layout";
import { cn } from "@/lib/utils";
import { Bell, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export function NotificationPanel() {
  const {
    items,
    unreadCount,
    open,
    closePanel,
    markRead,
    markAllRead,
  } = useNotifications();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <>
      <button
        type="button"
        className="fixed inset-0 z-[90] bg-black/30"
        aria-label="알림 닫기"
        onClick={closePanel}
      />
      <div
        className={cn(mobileFixedClass, "top-0 z-[95] pt-[env(safe-area-inset-top)]")}
        style={{ pointerEvents: "none" }}
      >
        <div
          className="mx-3 overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-foreground/5"
          style={{
            marginTop: `calc(${APP_PAGE_HEADER_HEIGHT}px + 8px)`,
            pointerEvents: "auto",
          }}
        >
          <div className="flex items-center justify-between border-b border-foreground/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="size-5 text-primary" />
              <h2 className="text-base font-bold">알림</h2>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 ? (
                <button
                  type="button"
                  className="rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                  onClick={markAllRead}
                >
                  모두 읽음
                </button>
              ) : null}
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/5"
                aria-label="닫기"
                onClick={closePanel}
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          <div className="max-h-[min(420px,60vh)] overflow-y-auto">
            <NotificationsList
              items={items}
              compact
              onItemClick={(item) => {
                markRead(item.id);
                closePanel();
              }}
            />
          </div>

          <div className="border-t border-foreground/5 bg-[#f9fafb] px-4 py-3">
            <Link
              href="/messages"
              className="block text-center text-sm font-medium text-primary"
              onClick={closePanel}
            >
              알림 전체 보기
            </Link>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
