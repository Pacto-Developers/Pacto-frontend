import { FixedBottomCTA } from "@/components/mobile/fixed-bottom-cta";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import { campaigns, missionGuidelines } from "@/lib/mock-data";
import { Check } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CampaignDetailPage({ params }: PageProps) {
  const { id } = await params;
  const campaign = campaigns.find((c) => c.id === id);
  if (!campaign) notFound();

  const progressValue = Math.round((campaign.current / campaign.total) * 100);

  return (
    <div className="min-h-full bg-[#f2f4f6] pb-28">
      <MobileHeader title="캠페인 상세" showBackButton backHref="/explore" />

      <Image
        src={campaign.image}
        alt={campaign.title}
        width={960}
        height={480}
        className="aspect-[2/1] w-full object-cover"
        unoptimized
      />

      <div className="space-y-3 px-4 py-4">
        <Card className="rounded-2xl border-0 py-4 shadow-none ring-0">
          <CardContent className="space-y-2 px-4">
            <span className="text-xs text-muted-foreground">{campaign.brand}</span>
            <h2 className="text-xl font-bold leading-snug">{campaign.title}</h2>
            <p className="text-2xl font-bold text-primary">{campaign.reward}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 py-4 shadow-none ring-0">
          <CardContent className="space-y-3 px-4">
            <h3 className="font-semibold">미션 가이드</h3>
            <ul className="space-y-2">
              {missionGuidelines.map((text) => (
                <li key={text} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {text}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 py-4 shadow-none ring-0">
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
            <Progress value={progressValue} className="gap-0">
              <ProgressTrack className="h-2 bg-[#f2f4f6]">
                <ProgressIndicator className="bg-primary" />
              </ProgressTrack>
            </Progress>
          </div>
        </Card>
      </div>

      <FixedBottomCTA text="미션 수락하기" />
    </div>
  );
}
