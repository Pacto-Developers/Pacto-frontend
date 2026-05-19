"use client";

import { MobileHeader } from "@/components/mobile/mobile-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { missions } from "@/lib/mock-data";
import Link from "next/link";
import { useState } from "react";

const tabs = ["진행 중", "완료", "전체"] as const;

export function MissionsContent() {
  const [activeTab, setActiveTab] = useState<string>("진행 중");
  const list =
    activeTab === "전체"
      ? missions
      : missions.filter((m) =>
          activeTab === "진행 중"
            ? m.status === "IN_PROGRESS"
            : m.status === "DONE",
        );
  const showEmpty = list.length === 0;

  return (
    <div className="flex min-h-full flex-col bg-[#f2f4f6]">
      <MobileHeader title="내 미션" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
        <TabsList className="w-full">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="flex-1">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex-1 space-y-3 px-4 py-4">
        {showEmpty ? (
          <Card className="rounded-2xl border-0 py-12 text-center shadow-none ring-0">
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                아직 진행 중인 미션이 없어요
              </p>
              <Link href="/explore">
                <Button>캠페인 찾기</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          list.map((mission) => (
            <Card
              key={mission.id}
              className="rounded-2xl border-0 shadow-none ring-0"
            >
              <CardContent className="px-4 py-2">
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground">{mission.brand}</p>
                  <p className="font-semibold">{mission.title}</p>
                  <p className="text-sm font-bold text-primary">
                    {mission.reward}
                  </p>
                </div>
                <Accordion>
                  <AccordionItem value="submit">
                    <AccordionTrigger>URL 제출하기</AccordionTrigger>
                    <AccordionContent>
                      <form
                        className="flex gap-2"
                        onSubmit={(e) => e.preventDefault()}
                      >
                        <Input placeholder="작성한 블로그 URL 입력" />
                        <Button type="submit">제출</Button>
                      </form>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
