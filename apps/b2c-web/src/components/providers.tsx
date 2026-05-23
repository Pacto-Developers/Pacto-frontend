"use client";

import { NotificationPanel } from "@/components/notifications/notification-panel";
import { NotificationProvider } from "@/components/notifications/notification-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        {children}
        <NotificationPanel />
      </NotificationProvider>
    </QueryClientProvider>
  );
}
