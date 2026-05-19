"use client";

import {
  EXPLORE_HEADER_HEIGHT,
  ExplorePageHeader,
} from "@/components/explore/explore-page-header";
import { CampaignListCard } from "@/components/mobile/campaign-list-card";
import type { Campaign } from "@/lib/mock-data";
import { selectCampaignList, useCampaigns } from "@/lib/api/hooks";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

export function ExploreContent() {
  const [category, setCategory] = useState<string>("전체");
  const [sort, setSort] = useState<string>("최신순");
  const { data: result, isLoading } = useCampaigns();

  const campaigns = selectCampaignList(result);

  const filtered = useMemo(() => {
    let list: Campaign[] = [...campaigns];
    if (category !== "전체") {
      list = list.filter((c) => c.category === category);
    }
    if (sort === "마감임박순") {
      list = [...list].sort(
        (a, b) => a.current / a.total - b.current / b.total,
      );
    }
    return list;
  }, [campaigns, category, sort]);

  return (
    <div className="min-h-full bg-[#f2f4f6] pb-24">
      <ExplorePageHeader
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
      />

      <main
        className="flex flex-col gap-3 px-4"
        style={{ paddingTop: EXPLORE_HEADER_HEIGHT + 16 }}
      >
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            해당 카테고리에 캠페인이 없습니다.
          </p>
        ) : (
          filtered.map((campaign, index) => (
            <CampaignListCard
              key={campaign.id}
              campaign={campaign}
              hot={index === 1}
              closed={campaign.current >= campaign.total && campaign.total > 0}
            />
          ))
        )}

        {!isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </main>
    </div>
  );
}
