"use client";

import {
  ConfirmRow,
  ConfirmSheet,
} from "@/components/trust/confirm-sheet";
import { TrustNotice } from "@/components/trust/trust-notice";
import { FixedBottomCTA } from "@/components/mobile/fixed-bottom-cta";
import { getAppPageHeaderOffset } from "@/components/mobile/app-page-header.constants";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNotifications } from "@/components/notifications/notification-context";
import {
  useAcceptMission,
  useCampaign,
  useCampaignGuidelines,
} from "@/lib/api/hooks";
import { formatKRW } from "@/lib/format-money";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CampaignDetailContentProps = {
  id: string;
};

export function CampaignDetailContent({ id }: CampaignDetailContentProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data: campaignResult, isLoading } = useCampaign(id);
  const { data: guidelinesResult } = useCampaignGuidelines(id);
  const { pushNotification } = useNotifications();
  const acceptMission = useAcceptMission(id);

  const campaign = campaignResult?.data ?? null;
  const guidelines = guidelinesResult?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#f2f4f6]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-full bg-[#f2f4f6]">
        <MobileHeader title="캠페인 상세" showBackButton backHref="/explore" />
        <p
          className="px-4 py-12 text-center text-muted-foreground"
          style={{ paddingTop: getAppPageHeaderOffset() + 48 }}
        >
          캠페인을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const progressValue = Math.round((campaign.current / campaign.total) * 100);
  const isClosed = campaign.current >= campaign.total;
  const rewardLabel =
    campaign.rewardAmount > 0
      ? formatKRW(campaign.rewardAmount)
      : campaign.reward;

  async function handleAccept() {
    await acceptMission.mutateAsync();
    pushNotification({
      type: "mission",
      title: "미션 수락 완료",
      body: `${campaign?.title ?? "캠페인"} 미션을 시작했어요. 가이드에 맞게 URL을 제출해 주세요.`,
      time: "방금",
      href: "/missions",
    });
    setConfirmOpen(false);
    router.push("/missions");
  }

  return (
    <div className="min-h-full bg-[#f2f4f6] pb-28">
      <MobileHeader title="캠페인 상세" showBackButton backHref="/explore" />

      <div style={{ paddingTop: getAppPageHeaderOffset() }}>
        <Image
          src={campaign.image}
          alt={campaign.title}
          width={960}
          height={480}
          className="aspect-[2/1] w-full object-cover"
          unoptimized
        />

        <div className="space-y-3 px-4 py-4">
          <Card className="rounded-2xl border-0 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ring-0">
            <CardContent className="space-y-2 px-4">
              <span className="text-xs text-muted-foreground">
                {campaign.brand}
              </span>
              <h2 className="text-xl font-bold leading-snug">{campaign.title}</h2>
              <p className="text-2xl font-bold text-primary">{campaign.reward}</p>
            </CardContent>
          </Card>

          <TrustNotice>
            미션 완료·광고주 승인 후 에스크로에서 정산되어 지갑에 들어와요.
          </TrustNotice>

          <Card className="rounded-2xl border-0 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ring-0">
            <CardContent className="space-y-3 px-4">
              <h3 className="font-semibold">미션 가이드</h3>
              <ul className="space-y-2">
                {guidelines.map((text) => (
                  <li
                    key={text}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ring-0">
            <CardContent className="flex items-center justify-between px-4">
              <div>
                <p className="text-sm text-muted-foreground">모집 현황</p>
                <p className="text-lg font-bold tabular-nums">
                  {campaign.current}/{campaign.total}명
                </p>
              </div>
              <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                {campaign.deadline}
              </Badge>
            </CardContent>
            <div className="px-4 pb-2">
              <Progress
                value={progressValue}
                className="gap-0 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-[#f2f4f6]"
              />
            </div>
          </Card>
        </div>
      </div>

      <FixedBottomCTA
        text={acceptMission.isPending ? "처리 중…" : "미션 수락하기"}
        onClick={() => setConfirmOpen(true)}
        disabled={isClosed || acceptMission.isPending}
      />

      <ConfirmSheet
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="이 캠페인에 참여할까요?"
        description="수락 후에는 가이드에 맞게 콘텐츠를 제출해 주세요"
        confirmLabel="미션 수락하기"
        loading={acceptMission.isPending}
        onConfirm={handleAccept}
      >
        <ConfirmRow label="캠페인" value={campaign.title} />
        <ConfirmRow label="보상" value={rewardLabel} emphasize />
        <ConfirmRow label="마감" value={campaign.deadline} />
        <p className="text-xs leading-relaxed text-muted-foreground">
          광고주 예치금이 에스크로에 잠긴 뒤, 승인 시 지갑으로 정산돼요.
        </p>
      </ConfirmSheet>
    </div>
  );
}
