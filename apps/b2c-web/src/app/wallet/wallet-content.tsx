"use client";

import { MobileHeader } from "@/components/mobile/mobile-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { walletHistory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

const filters = ["전체", "입금", "출금"] as const;

export function WalletContent() {
  const [filter, setFilter] = useState<string>("전체");
  const balance = 120000;

  const items = useMemo(() => {
    if (filter === "전체") return walletHistory;
    if (filter === "입금")
      return walletHistory.filter((h) => h.type === "deposit");
    return walletHistory.filter((h) => h.type === "withdraw");
  }, [filter]);

  return (
    <div className="min-h-full bg-[#f2f4f6]">
      <MobileHeader title="내 지갑" />

      <Card className="mx-4 mt-2 rounded-2xl border-0 bg-primary py-6 text-primary-foreground shadow-none ring-0">
        <CardContent className="space-y-4 px-5">
          <div>
            <p className="text-sm text-primary-foreground/80">보유 포인트</p>
            <p className="text-3xl font-bold tabular-nums">
              {balance.toLocaleString()}원
            </p>
          </div>
          <Button
            variant="secondary"
            className="w-full rounded-xl bg-white text-primary hover:bg-white/90"
          >
            출금 신청하기
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3 px-4 py-5">
        <h2 className="text-base font-semibold">포인트 내역</h2>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="w-full">
            {filters.map((f) => (
              <TabsTrigger key={f} value={f} className="flex-1">
                {f}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Card className="rounded-2xl border-0 py-0 shadow-none ring-0">
          <CardContent className="px-0 py-0">
            {items.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <Separator />}
                <div className="flex items-center justify-between px-4 py-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                    <p className="font-medium">{item.title}</p>
                  </div>
                  <p
                    className={cn(
                      "text-base font-bold tabular-nums",
                      item.amount > 0 ? "text-primary" : "text-foreground",
                    )}
                  >
                    {item.amount > 0 ? "+" : ""}
                    {item.amount.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
