export function CampaignListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex gap-3 rounded-2xl bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
        >
          <div className="size-[100px] shrink-0 animate-pulse rounded-xl bg-[#f2f4f6]" />
          <div className="flex flex-1 flex-col justify-center gap-2 py-1">
            <div className="h-3 w-16 animate-pulse rounded bg-[#f2f4f6]" />
            <div className="h-4 w-full animate-pulse rounded bg-[#f2f4f6]" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-[#f2f4f6]" />
            <div className="mt-1 h-2 w-full animate-pulse rounded-full bg-[#f2f4f6]" />
          </div>
        </div>
      ))}
    </div>
  );
}
