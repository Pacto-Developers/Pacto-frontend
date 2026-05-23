"use client";

import { EmptyState } from "@/components/trust/empty-state";
import { MissionTimeline } from "@/components/trust/mission-timeline";
import { StatusChip } from "@/components/trust/status-chip";
import { TrustNotice } from "@/components/trust/trust-notice";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { getAppPageHeaderOffset } from "@/components/mobile/app-page-header.constants";
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
import {
  selectMissionList,
  useMyMissions,
  useSubmitMissionUrl,
} from "@/lib/api/hooks";
import { ClipboardList, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const tabs = ["진행 중", "완료", "전체"] as const;

export function MissionsContent() {
  const [activeTab, setActiveTab] = useState<string>("진행 중");
  const { data: result, isLoading } = useMyMissions();
  const submitUrl = useSubmitMissionUrl();

  const missions = selectMissionList(result);
  const list =
    activeTab === "전체"
      ? missions
      : missions.filter((m) =>
          activeTab === "진행 중"
            ? m.status === "IN_PROGRESS" || m.status === "LOCKED"
            : m.status === "DONE",
        );
  const showEmpty = !isLoading && list.length === 0;

  return (
    <div className="flex min-h-full flex-col bg-[#f2f4f6]">
      <MobileHeader title="내 미션" />

      <div style={{ paddingTop: getAppPageHeaderOffset() }}>
        <div className="px-4 pb-3">
          <TrustNotice>
            미션 보상은 광고주 승인 후 에스크로에서 풀려 지갑으로 들어와요.
          </TrustNotice>
        </div>

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
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-2xl bg-white"
                />
              ))}
            </div>
          ) : showEmpty ? (
            <EmptyState
              icon={<ClipboardList className="size-10" strokeWidth={1.5} />}
              message={
                activeTab === "완료"
                  ? "완료된 미션이 없어요"
                  : "진행 중인 미션이 없어요"
              }
              description="맞는 캠페인을 찾아 미션을 수락해 보세요"
              actionLabel="캠페인 찾기"
              actionHref="/explore"
            />
          ) : (
            list.map((mission) => (
              <Card
                key={mission.id}
                className="rounded-2xl border-0 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ring-0"
              >
                <CardContent className="space-y-3 px-4 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        {mission.brand}
                      </p>
                      <p className="font-semibold">{mission.title}</p>
                      <p className="text-sm font-bold text-primary">
                        {mission.reward}
                      </p>
                    </div>
                    <StatusChip status={mission.status} />
                  </div>

                  <div className="rounded-xl bg-[#f2f4f6] px-3 py-3">
                    <MissionTimeline status={mission.status} />
                  </div>

                  {mission.status === "LOCKED" ? (
                    <Accordion>
                      <AccordionItem value="submit" className="border-0">
                        <AccordionTrigger className="py-2 text-sm font-medium">
                          URL 제출하기
                        </AccordionTrigger>
                        <AccordionContent>
                          <form
                            className="flex gap-2"
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const form = e.currentTarget;
                              const input = form.elements.namedItem(
                                "url",
                              ) as HTMLInputElement;
                              const url = input.value.trim();
                              if (!url) return;
                              await submitUrl.mutateAsync({
                                escrowId: mission.id,
                                url,
                              });
                              input.value = "";
                            }}
                          >
                            <Input
                              name="url"
                              placeholder="작성한 블로그 URL"
                              className="rounded-xl border-0 bg-[#f2f4f6] ring-1 ring-foreground/8"
                            />
                            <Button
                              type="submit"
                              disabled={submitUrl.isPending}
                              className="shrink-0 rounded-xl"
                            >
                              {submitUrl.isPending ? "…" : "제출"}
                            </Button>
                          </form>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : null}

                  {mission.status === "DONE" ? (
                    <Link href="/wallet">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl"
                      >
                        지갑에서 확인하기
                      </Button>
                    </Link>
                  ) : null}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
