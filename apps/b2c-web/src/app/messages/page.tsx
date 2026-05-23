"use client";

import { NotificationsList } from "@/components/notifications/notifications-list";
import { useNotifications } from "@/components/notifications/notification-context";
import { getAppPageHeaderOffset } from "@/components/mobile/app-page-header.constants";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";

export default function MessagesPage() {
  const { items, unreadCount, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = useMemo(() => {
    if (filter === "unread") return items.filter((item) => !item.read);
    return items;
  }, [filter, items]);

  return (
    <div className="min-h-full bg-[#f2f4f6]">
      <MobileHeader
        title="알림"
        variant="sub"
        showBackButton
        backHref="/explore"
        showNotification={false}
      />

      <div
        className="space-y-4 px-4 pb-6"
        style={{ paddingTop: getAppPageHeaderOffset() + 16 }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            정산·미션·캠페인 소식을 확인해요
            {unreadCount > 0 ? ` · 읽지 않음 ${unreadCount}건` : ""}
          </p>
          {unreadCount > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0 text-primary"
              onClick={markAllRead}
            >
              모두 읽음
            </Button>
          ) : null}
        </div>

        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as "all" | "unread")}
        >
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              전체
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              읽지 않음
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <NotificationsList
            items={filtered}
            onItemClick={(item) => markRead(item.id)}
          />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          목업 알림 · 실제 푸시 연동 전 데모 데이터입니다
        </p>
      </div>
    </div>
  );
}
