"use client";

import { ConfirmDialog, ConfirmRow } from "@/components/trust/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { BffError } from "@/lib/api/bff";
import type { EscrowRow } from "@/lib/api/escrows";
import {
  useApproveMission,
  useCancelEscrow,
  useCancelMission,
  useEscrows,
  useReleaseEscrow,
} from "@/lib/api/hooks";
import type { EscrowStatus, MissionCancelReason } from "@pacto/api-client";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

const filters = [
  { value: "all", label: "전체" },
  { value: "LOCKED", label: "잠금" },
  { value: "RELEASED", label: "정산 완료" },
  { value: "CANCELED", label: "취소" },
] as const;

const statusLabel: Record<EscrowStatus, string> = {
  LOCKED: "잠금",
  RELEASED: "정산 완료",
  CANCELED: "취소",
};

const missionStatusLabel = {
  LOCKED: "진행 중",
  SUBMITTED: "검토 대기",
  RELEASED: "완료",
  CANCELED: "취소",
} as const;

/** 제출 거절 = 미션 API · 예치금 반환 = 에스크로 API (동시 노출 금지) */
type ActionType = "approve" | "rejectSubmission" | "release" | "returnDeposit";

type PendingAction = {
  type: ActionType;
  row: EscrowRow;
};

type EscrowManagementProps = {
  title: string;
  description: string;
};

export function EscrowManagement({ title, description }: EscrowManagementProps) {
  const [filter, setFilter] = useState<string>("all");
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [returnReason, setReturnReason] = useState("미션 취소");

  const statusParam =
    filter === "all" ? undefined : (filter as EscrowStatus);

  const { data: escrows = [], isLoading, refetch, error } = useEscrows(statusParam);
  const approve = useApproveMission();
  const cancelMission = useCancelMission();
  const release = useReleaseEscrow();
  const cancelEscrow = useCancelEscrow();

  const [actionError, setActionError] = useState<string | null>(null);
  const pending =
    approve.isPending ||
    cancelMission.isPending ||
    release.isPending ||
    cancelEscrow.isPending;

  const list = useMemo(() => escrows, [escrows]);

  async function executeAction() {
    if (!pendingAction) return;
    setActionError(null);
    const id = String(pendingAction.row.escrow_id);

    try {
      switch (pendingAction.type) {
        case "approve":
          await approve.mutateAsync(id);
          break;
        case "rejectSubmission":
          await cancelMission.mutateAsync({
            escrowId: id,
            reason: "ADVERTISER_REJECT" satisfies MissionCancelReason,
          });
          break;
        case "release":
          await release.mutateAsync(id);
          break;
        case "returnDeposit":
          await cancelEscrow.mutateAsync({
            escrowId: id,
            reason: returnReason.trim() || "미션 취소",
          });
          break;
      }
      setPendingAction(null);
    } catch (e) {
      setActionError(
        e instanceof BffError ? e.message : "요청에 실패했습니다.",
      );
    }
  }

  const dialogCopy = getDialogCopy(pendingAction);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="rounded-lg border border-foreground/10 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">처리 안내</p>
        <ul className="mt-1.5 list-inside list-disc space-y-0.5">
          <li>
            <strong className="font-medium text-foreground">승인</strong> — URL
            검토 통과, 블로거에게 정산
          </li>
          <li>
            <strong className="font-medium text-foreground">제출 거절</strong> —
            제출물 불합격 (블로거 미지급 · 예치금 복귀)
          </li>
          <li>
            <strong className="font-medium text-foreground">예치금 반환</strong>{" "}
            — URL 미제출·진행 중 미션 취소 (블로거 미지급 · 예치금 복귀)
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f.value}
            type="button"
            size="sm"
            variant={filter === f.value ? "default" : "outline"}
            className={cn(filter === f.value && "pointer-events-none")}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {error ? (
        <p className="text-sm text-destructive">
          목록을 불러오지 못했습니다. 광고주 계정·API 설정을 확인해 주세요.
        </p>
      ) : null}

      {actionError ? (
        <p className="text-sm text-destructive">{actionError}</p>
      ) : null}

      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>캠페인 / 블로거</TableHead>
                <TableHead>금액</TableHead>
                <TableHead>에스크로</TableHead>
                <TableHead>미션</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-muted-foreground"
                  >
                    내역이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                list.map((row) => (
                  <EscrowRowActions
                    key={row.escrow_id}
                    row={row}
                    pending={pending}
                    onApprove={() => setPendingAction({ type: "approve", row })}
                    onRejectSubmission={() => {
                      setRejectNote("");
                      setPendingAction({ type: "rejectSubmission", row });
                    }}
                    onRelease={() => setPendingAction({ type: "release", row })}
                    onReturnDeposit={() => {
                      setReturnReason("미션 취소");
                      setPendingAction({ type: "returnDeposit", row });
                    }}
                  />
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          새로고침
        </Button>
      </div>

      <ConfirmDialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
        title={dialogCopy.title}
        description={dialogCopy.description}
        confirmLabel={dialogCopy.confirmLabel}
        variant={dialogCopy.variant}
        loading={pending}
        onConfirm={executeAction}
        reason={
          pendingAction?.type === "rejectSubmission"
            ? rejectNote
            : pendingAction?.type === "returnDeposit"
              ? returnReason
              : ""
        }
        onReasonChange={
          pendingAction?.type === "rejectSubmission"
            ? setRejectNote
            : pendingAction?.type === "returnDeposit"
              ? setReturnReason
              : undefined
        }
        reasonLabel={
          pendingAction?.type === "rejectSubmission"
            ? "거절 메모 (내부용)"
            : pendingAction?.type === "returnDeposit"
              ? "취소 사유"
              : undefined
        }
        reasonRequired={pendingAction?.type === "returnDeposit"}
      >
        {pendingAction ? (
          <>
            <ConfirmRow label="캠페인" value={pendingAction.row.campaign_title} />
            <ConfirmRow label="블로거" value={pendingAction.row.blogger_name} />
            <ConfirmRow
              label="금액"
              value={`${pendingAction.row.amount.toLocaleString()} P`}
              emphasize
            />
            <ConfirmRow
              label="미션 상태"
              value={
                missionStatusLabel[
                  (pendingAction.row.mission_status ??
                    "LOCKED") as keyof typeof missionStatusLabel
                ] ?? pendingAction.row.mission_status
              }
            />
          </>
        ) : null}
      </ConfirmDialog>
    </div>
  );
}

function getDialogCopy(action: PendingAction | null) {
  if (!action) {
    return {
      title: "",
      description: "",
      confirmLabel: "확인",
      variant: "default" as const,
    };
  }

  switch (action.type) {
    case "approve":
      return {
        title: "미션을 승인할까요?",
        description: "승인 시 에스크로가 정산되어 블로거 지갑에 반영됩니다.",
        confirmLabel: "승인하기",
        variant: "default" as const,
      };
    case "rejectSubmission":
      return {
        title: "제출을 거절할까요?",
        description:
          "블로거에게는 지급되지 않고, 잠긴 금액이 광고주 예치금으로 돌아갑니다.",
        confirmLabel: "제출 거절",
        variant: "destructive" as const,
      };
    case "release":
      return {
        title: "에스크로 정산을 실행할까요?",
        description: "잠금 금액이 블로거에게 지급됩니다.",
        confirmLabel: "정산 실행",
        variant: "default" as const,
      };
    case "returnDeposit":
      return {
        title: "미션을 취소하고 예치금을 반환할까요?",
        description:
          "URL 제출 전·진행 중인 미션입니다. 블로거 미지급, 잠금 금액만 예치금으로 복귀합니다.",
        confirmLabel: "예치금 반환",
        variant: "destructive" as const,
      };
  }
}

function EscrowRowActions({
  row,
  pending,
  onApprove,
  onRejectSubmission,
  onRelease,
  onReturnDeposit,
}: {
  row: EscrowRow;
  pending: boolean;
  onApprove: () => void;
  onRejectSubmission: () => void;
  onRelease: () => void;
  onReturnDeposit: () => void;
}) {
  const missionStatus = row.mission_status ?? "LOCKED";
  const escrowLocked = row.status === "LOCKED";
  const canApprove = escrowLocked && missionStatus === "SUBMITTED";
  /** URL 제출 후 검토 불합격 — 미션 취소 API */
  const canRejectSubmission = escrowLocked && missionStatus === "SUBMITTED";
  /** URL 미제출·진행 중 — 에스크로 취소 API (제출 거절과 동시 노출 안 함) */
  const canReturnDeposit = escrowLocked && missionStatus === "LOCKED";
  const canRelease = escrowLocked && missionStatus === "RELEASED";
  const hasAction =
    canApprove || canRejectSubmission || canReturnDeposit || canRelease;

  return (
    <TableRow>
      <TableCell>
        <p className="font-medium">{row.campaign_title}</p>
        <p className="text-xs text-muted-foreground">{row.blogger_name}</p>
        {row.submitted_url ? (
          <a
            href={row.submitted_url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-primary underline-offset-4 hover:underline"
          >
            제출 URL
          </a>
        ) : null}
      </TableCell>
      <TableCell>{row.amount.toLocaleString()} P</TableCell>
      <TableCell>
        <Badge variant="outline">{statusLabel[row.status]}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">
          {missionStatusLabel[missionStatus as keyof typeof missionStatusLabel] ??
            missionStatus}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex flex-wrap justify-end gap-2">
          {canApprove ? (
            <Button size="sm" disabled={pending} onClick={onApprove}>
              승인
            </Button>
          ) : null}
          {canRejectSubmission ? (
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={onRejectSubmission}
            >
              제출 거절
            </Button>
          ) : null}
          {canReturnDeposit ? (
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={onReturnDeposit}
            >
              예치금 반환
            </Button>
          ) : null}
          {canRelease ? (
            <Button size="sm" variant="secondary" disabled={pending} onClick={onRelease}>
              정산 실행
            </Button>
          ) : null}
          {!hasAction ? (
            <span className="text-xs text-muted-foreground">—</span>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}
