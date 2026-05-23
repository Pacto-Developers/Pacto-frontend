"use client";

import { CampaignListSkeleton } from "@/components/explore/campaign-list-skeleton";
import { ExploreWelcomeBanner } from "@/components/explore/explore-welcome-banner";
import {
  EXPLORE_HEADER_HEIGHT,
  ExplorePageHeader,
} from "@/components/explore/explore-page-header";
import { EmptyState } from "@/components/trust/empty-state";
import { TrustNotice } from "@/components/trust/trust-notice";
import { CampaignListCard } from "@/components/mobile/campaign-list-card";
import type { Campaign } from "@/lib/mock-data";
import { selectCampaignList, useCampaigns } from "@/lib/api/hooks";
import { Suspense, useMemo, useState } from "react";

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
        <Suspense fallback={null}>
          <ExploreWelcomeBanner />
        </Suspense>

        <TrustNotice>
          캠페인 보상은 미션 완료·광고주 승인 후 에스크로에서 정산돼요.
        </TrustNotice>

        {isLoading ? (
          <CampaignListSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            message="해당 조건의 캠페인이 없어요"
            description="다른 카테고리나 정렬을 바꿔 보세요"
            actionLabel="전체 보기"
            onAction={() => setCategory("전체")}
          />
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
      </main>
    </div>
  );
}
