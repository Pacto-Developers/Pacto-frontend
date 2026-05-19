"use client";

import { AppPageHeader } from "@/components/mobile/app-page-header";
import {
  APP_PAGE_HEADER_HEIGHT,
  APP_PAGE_SECONDARY_HEIGHT,
} from "@/components/mobile/app-page-header.constants";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = ["전체", "맛집", "뷰티", "IT/테크", "라이프"] as const;
const sortOptions = ["최신순", "마감임박순"] as const;

export const EXPLORE_HEADER_HEIGHT =
  APP_PAGE_HEADER_HEIGHT + APP_PAGE_SECONDARY_HEIGHT;

type ExplorePageHeaderProps = {
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
};

export function ExplorePageHeader({
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: ExplorePageHeaderProps) {
  return (
    <AppPageHeader
      title="캠페인"
      secondary={
        <>
          <div className="hide-scrollbar flex flex-1 items-center gap-2 overflow-x-auto pr-3">
            {categories.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onCategoryChange(cat)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                    active
                      ? "bg-[#1071e5] text-white"
                      : "bg-[#eceef0] text-[#414754] hover:bg-[#e0e3e5]",
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center border-l border-[#e0e3e5] pl-3">
            <Select value={sort} onValueChange={(v) => v && onSortChange(v)}>
              <SelectTrigger className="h-auto gap-0.5 border-0 bg-transparent p-0 text-sm font-semibold text-[#414754] shadow-none focus-visible:ring-0 [&>svg]:hidden">
                <SelectValue />
                <ChevronDown className="size-4 text-muted-foreground" />
              </SelectTrigger>
              <SelectContent align="end">
                {sortOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      }
    />
  );
}
