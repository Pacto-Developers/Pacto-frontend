import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

type EmptyStateProps = {
  message: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
  icon?: ReactNode;
};

export function EmptyState({
  message,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      {icon ? <div className="mb-4 text-muted-foreground">{icon}</div> : null}
      <p className="font-medium text-foreground">{message}</p>
      {description ? (
        <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="mt-5">
          <Button className="rounded-xl">{actionLabel}</Button>
        </Link>
      ) : null}
      {actionLabel && onAction ? (
        <Button className="mt-5 rounded-xl" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
