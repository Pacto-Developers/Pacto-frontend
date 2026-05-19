import { Progress } from "@/components/ui/progress";
import type { Campaign } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type CampaignListCardProps = {
  campaign: Campaign;
  closed?: boolean;
  hot?: boolean;
  className?: string;
};

export function CampaignListCard({
  campaign,
  closed = false,
  hot = false,
  className,
}: CampaignListCardProps) {
  const progressValue = Math.round((campaign.current / campaign.total) * 100);
  const isFull = campaign.current >= campaign.total;
  const isClosed = closed || isFull;

  return (
    <Link
      href={isClosed ? "#" : `/campaigns/${campaign.id}`}
      className={cn(
        "block rounded-2xl bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
        isClosed && "pointer-events-none opacity-60",
        className,
      )}
      onClick={isClosed ? (e) => e.preventDefault() : undefined}
    >
      <div className="flex gap-3">
        <div className="relative size-[100px] shrink-0">
          <Image
            src={campaign.image}
            alt={campaign.title}
            width={200}
            height={200}
            className="size-[100px] rounded-xl object-cover"
            unoptimized
          />
          {hot && !isClosed && (
            <span className="absolute left-1.5 top-1.5 rounded bg-[#d8e3f5] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-[#111c29]">
              인기
            </span>
          )}
          {isClosed && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/50">
              <span className="rounded-full bg-[#2d3133] px-2 py-1 text-[11px] font-semibold text-[#eff1f3]">
                마감
              </span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <div className="mb-1 flex items-start justify-between gap-2">
              <h2
                className={cn(
                  "line-clamp-2 text-base font-semibold leading-snug",
                  isClosed ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {campaign.title}
              </h2>
              <MoreVertical className="size-5 shrink-0 text-muted-foreground" />
            </div>
            <p
              className={cn(
                "text-sm font-bold",
                isClosed ? "text-muted-foreground" : "text-primary",
              )}
            >
              {campaign.rewardAmount > 0
                ? `${campaign.rewardAmount.toLocaleString()} P`
                : campaign.reward}
            </p>
          </div>

          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{isClosed ? "모집완료" : "모집현황"}</span>
              <span className="font-semibold">
                {isClosed ? (
                  <span>
                    {campaign.total}/{campaign.total}명
                  </span>
                ) : (
                  <>
                    <span className="text-primary">{campaign.current}</span>/
                    {campaign.total}명
                  </>
                )}
              </span>
            </div>
            <Progress
              value={isFull ? 100 : progressValue}
              className={cn(
                "gap-0 [&_[data-slot=progress-indicator]]:h-1.5 [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:rounded-full [&_[data-slot=progress-track]]:bg-[#eceef0] [&_[data-slot=progress-indicator]]:rounded-full",
                isClosed &&
                  "[&_[data-slot=progress-indicator]]:bg-muted-foreground",
              )}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
