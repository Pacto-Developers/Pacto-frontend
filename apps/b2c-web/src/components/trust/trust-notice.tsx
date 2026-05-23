import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

type TrustNoticeProps = {
  children: ReactNode;
  className?: string;
};

export function TrustNotice({ children, className }: TrustNoticeProps) {
  return (
    <div
      className={cn(
        "flex gap-2.5 rounded-xl bg-primary/8 px-3.5 py-3 text-xs leading-relaxed text-foreground/90",
        className,
      )}
    >
      <ShieldCheck
        className="mt-0.5 size-4 shrink-0 text-primary"
        strokeWidth={2}
        aria-hidden
      />
      <p>{children}</p>
    </div>
  );
}
