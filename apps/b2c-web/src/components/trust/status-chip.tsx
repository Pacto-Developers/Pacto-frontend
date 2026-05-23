import { cn } from "@/lib/utils";

export type MissionStatusKind =
  | "LOCKED"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELED"
  | "PENDING";

const CONFIG: Record<
  MissionStatusKind,
  { label: string; className: string }
> = {
  LOCKED: {
    label: "진행 중",
    className: "bg-primary/10 text-primary",
  },
  IN_PROGRESS: {
    label: "검수 중",
    className: "bg-amber-500/15 text-amber-700",
  },
  PENDING: {
    label: "처리 중",
    className: "bg-amber-500/15 text-amber-700",
  },
  DONE: {
    label: "정산 완료",
    className: "bg-emerald-500/15 text-emerald-700",
  },
  CANCELED: {
    label: "취소됨",
    className: "bg-foreground/8 text-muted-foreground",
  },
};

type StatusChipProps = {
  status: MissionStatusKind;
  className?: string;
};

export function StatusChip({ status, className }: StatusChipProps) {
  const { label, className: tone } = CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone,
        className,
      )}
    >
      {label}
    </span>
  );
}

export function missionStatusToChip(
  status: "LOCKED" | "IN_PROGRESS" | "DONE" | "CANCELED",
): MissionStatusKind {
  return status;
}
