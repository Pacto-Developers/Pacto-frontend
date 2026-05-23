"use client";

import {
  MOCK_NOTIFICATIONS,
  type AppNotification,
} from "@/lib/mock-notifications";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type PushNotificationInput = Omit<AppNotification, "id" | "read"> & {
  read?: boolean;
};

type NotificationContextValue = {
  items: AppNotification[];
  unreadCount: number;
  open: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  /** 목업: 앱 내 알림 추가 (출금·정산 등) */
  pushNotification: (item: PushNotificationInput) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [open, setOpen] = useState(false);

  const unreadCount = useMemo(
    () => items.filter((item) => !item.read).length,
    [items],
  );

  const markRead = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const pushNotification = useCallback((item: PushNotificationInput) => {
    const entry: AppNotification = {
      ...item,
      id: `n-${Date.now()}`,
      read: item.read ?? false,
    };
    setItems((prev) => [entry, ...prev]);
  }, []);

  const value = useMemo<NotificationContextValue>(
    () => ({
      items,
      unreadCount,
      open,
      openPanel: () => setOpen(true),
      closePanel: () => setOpen(false),
      togglePanel: () => setOpen((v) => !v),
      markRead,
      markAllRead,
      pushNotification,
    }),
    [items, unreadCount, open, markRead, markAllRead, pushNotification],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
}
