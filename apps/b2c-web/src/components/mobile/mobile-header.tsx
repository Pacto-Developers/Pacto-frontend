import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type MobileHeaderProps = {
  title: string;
  showBackButton?: boolean;
  backHref?: string;
  className?: string;
};

export function MobileHeader({
  title,
  showBackButton = false,
  backHref = "/explore",
  className,
}: MobileHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center gap-2 bg-[#f2f4f6]/95 px-4 py-3 backdrop-blur",
        className,
      )}
    >
      {showBackButton ? (
        <Link
          href={backHref}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-sm"
          aria-label="뒤로 가기"
        >
          <ChevronLeft className="size-5" />
        </Link>
      ) : (
        <span className="size-9 shrink-0" />
      )}
      <h1 className="flex-1 text-center text-lg font-bold tracking-tight">
        {title}
      </h1>
      <span className="size-9 shrink-0" />
    </header>
  );
}
