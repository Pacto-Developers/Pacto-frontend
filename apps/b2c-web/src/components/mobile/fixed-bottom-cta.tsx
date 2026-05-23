"use client";

import { Button } from "@/components/ui/button";
import { mobileFixedClass } from "@/lib/mobile-layout";
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
    <div
      className={cn(
        mobileFixedClass,
        "bottom-0 border-t border-border/50 bg-white/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur",
      )}
    >
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
