import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import type { Campaign } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type CampaignCardProps = {
  campaign: Campaign;
  className?: string;
};

export function CampaignCard({ campaign, className }: CampaignCardProps) {
  const progressValue = Math.round((campaign.current / campaign.total) * 100);

  return (
    <Link href={`/campaigns/${campaign.id}`} className={cn("block", className)}>
      <Card className="gap-0 overflow-hidden rounded-2xl border-0 py-0 shadow-none ring-0">
        <Image
          src={campaign.image}
          alt={campaign.title}
          width={800}
          height={400}
          className="aspect-[2/1] w-full object-cover"
          unoptimized
        />
        <CardContent className="space-y-3 px-4 pb-4 pt-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {campaign.brand}
            </span>
            <Badge
              variant="secondary"
              className="rounded-full bg-[#f2f4f6] text-xs font-medium text-muted-foreground"
            >
              {campaign.deadline}
            </Badge>
          </div>
          <h3 className="mb-1 text-base font-semibold leading-snug text-foreground">
            {campaign.title}
          </h3>
          <p className="text-lg font-bold text-primary">{campaign.reward}</p>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>모집 현황</span>
              <span className="font-medium tabular-nums text-foreground">
                {campaign.current}/{campaign.total}명
              </span>
            </div>
            <Progress value={progressValue} className="gap-0">
              <ProgressTrack className="h-1.5 bg-[#f2f4f6]">
                <ProgressIndicator className="bg-primary" />
              </ProgressTrack>
            </Progress>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
