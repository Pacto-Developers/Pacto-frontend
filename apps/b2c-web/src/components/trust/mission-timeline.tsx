import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { Mission } from "@/lib/mock-data";

const STEPS = [
  { key: "accepted", label: "미션 수락" },
  { key: "submit", label: "URL 제출" },
  { key: "review", label: "광고주 검수" },
  { key: "done", label: "정산 완료" },
] as const;

type StepState = "done" | "current" | "upcoming" | "canceled";

function getStepState(status: Mission["status"], stepIndex: number): StepState {
  if (status === "CANCELED") {
    return stepIndex === 0 ? "done" : "canceled";
  }
  if (status === "LOCKED") {
    if (stepIndex === 0) return "done";
    if (stepIndex === 1) return "current";
    return "upcoming";
  }
  if (status === "IN_PROGRESS") {
    if (stepIndex <= 1) return "done";
    if (stepIndex === 2) return "current";
    return "upcoming";
  }
  if (status === "DONE") {
    return "done";
  }
  return "upcoming";
}

type MissionTimelineProps = {
  status: Mission["status"];
  className?: string;
};

export function MissionTimeline({ status, className }: MissionTimelineProps) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {STEPS.map((step, index) => {
        const state = getStepState(status, index);
        const isLast = index === STEPS.length - 1;

        return (
          <li key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  state === "done" && "bg-primary text-primary-foreground",
                  state === "current" &&
                    "bg-primary/15 text-primary ring-2 ring-primary/30",
                  state === "upcoming" &&
                    "bg-foreground/8 text-muted-foreground",
                  state === "canceled" &&
                    "bg-foreground/8 text-muted-foreground",
                )}
              >
                {state === "done" ? (
                  <Check className="size-3.5" strokeWidth={3} />
                ) : (
                  index + 1
                )}
              </span>
              {!isLast ? (
                <span
                  className={cn(
                    "my-0.5 min-h-[20px] w-0.5 flex-1",
                    state === "done" ? "bg-primary/40" : "bg-foreground/10",
                  )}
                />
              ) : null}
            </div>
            <div className={cn("pb-4", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-xs font-medium",
                  state === "current" && "text-primary",
                  state === "done" && "text-foreground",
                  (state === "upcoming" || state === "canceled") &&
                    "text-muted-foreground",
                )}
              >
                {step.label}
              </p>
              {state === "current" && status === "IN_PROGRESS" && index === 2 ? (
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  승인 후 지갑에 반영돼요
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
