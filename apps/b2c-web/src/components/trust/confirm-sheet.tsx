"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { mobileFixedClass } from "@/lib/mobile-layout";
import { cn } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ConfirmSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  confirmDisabled?: boolean;
};

export function ConfirmSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  loading = false,
  confirmDisabled = false,
}: ConfirmSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200]">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="닫기"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          mobileFixedClass,
          "bottom-0 z-[201] rounded-t-2xl bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom duration-300",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-sheet-title"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id="confirm-sheet-title"
              className="text-lg font-bold text-foreground"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/5"
            aria-label="닫기"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mb-5 space-y-3">{children}</div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-12 flex-1 rounded-xl"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            className="h-12 flex-1 rounded-xl bg-primary font-semibold shadow-[0_4px_14px_rgba(49,130,246,0.35)]"
            disabled={loading || confirmDisabled}
            onClick={() => void onConfirm()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                처리 중…
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

type ConfirmRowProps = {
  label: string;
  value: ReactNode;
  emphasize?: boolean;
};

export function ConfirmRow({ label, value, emphasize }: ConfirmRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-right font-medium text-foreground",
          emphasize && "text-base font-bold tabular-nums",
        )}
      >
        {value}
      </span>
    </div>
  );
}
