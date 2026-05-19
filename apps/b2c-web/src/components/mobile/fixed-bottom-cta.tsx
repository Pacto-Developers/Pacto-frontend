"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FixedBottomCTAProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function FixedBottomCTA({
  text,
  onClick,
  disabled,
  className,
}: FixedBottomCTAProps) {
  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-border/50 bg-white/95 p-4 backdrop-blur">
      <Button
        size="lg"
        className={cn(
          "h-14 w-full rounded-2xl text-base font-semibold shadow-lg",
          className,
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </Button>
    </div>
  );
}
