"use client";

import { CampaignCard } from "@/components/mobile/campaign-card";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { campaigns, type Campaign } from "@/lib/mock-data";
import { useMemo, useState } from "react";

const categories = ["전체", "맛집", "뷰티", "IT/테크"] as const;
const sortOptions = ["최신순", "마감임박순"] as const;

export function ExploreContent() {
  const [category, setCategory] = useState<string>("전체");
  const [sort, setSort] = useState<string>("최신순");

  const filtered = useMemo(() => {
    let list: Campaign[] = [...campaigns];
    if (category !== "전체") {
      list = list.filter((c) => c.category === category);
    }
    if (sort === "마감임박순") {
      list = [...list].sort((a, b) => a.current / a.total - b.current / b.total);
    }
    return list;
  }, [category, sort]);

  return (
    <div className="flex min-h-full flex-col bg-[#f2f4f6]">
      <MobileHeader title="캠페인 탐색" />

      <div className="space-y-3 px-4 pb-4">
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="shrink-0 rounded-full border border-transparent bg-white px-4 py-2 text-sm data-active:border-primary data-active:bg-primary data-active:text-primary-foreground"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Select value={sort} onValueChange={(v) => v && setSort(v)}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1 px-4 pb-6">
        <ul className="space-y-3">
          {filtered.map((campaign) => (
            <li key={campaign.id}>
              <CampaignCard campaign={campaign} />
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
