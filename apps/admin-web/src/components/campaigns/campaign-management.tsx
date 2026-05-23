"use client";

import { ConfirmDialog, ConfirmRow } from "@/components/trust/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BffError } from "@/lib/api/bff";
import { useApproveMission, useCancelMission } from "@/lib/api/hooks";
import type { MissionCancelReason } from "@pacto/api-client";
import { useState } from "react";

const campaigns = [
  {
    id: "1",
    title: "강남역 팝업스토어 리뷰",
    pending: 5,
    approved: 10,
    applicants: [
      {
        name: "블로거A",
        url: "https://blog.example.com/a",
        escrowId: "101",
        missionStatus: "SUBMITTED" as const,
      },
      {
        name: "블로거B",
        url: "https://blog.example.com/b",
        escrowId: "102",
        missionStatus: "LOCKED" as const,
      },
    ],
  },
  {
    id: "2",
    title: "신메뉴 시식단 모집",
    pending: 12,
    approved: 3,
    applicants: [
      {
        name: "블로거C",
        url: "https://blog.example.com/c",
        escrowId: "103",
        missionStatus: "RELEASED" as const,
      },
    ],
  },
];

type PendingApplicantAction = {
  type: "approve" | "reject";
  campaignTitle: string;
  name: string;
  url: string;
  escrowId: string;
};

export function CampaignManagement() {
  const approve = useApproveMission();
  const cancelMission = useCancelMission();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingApplicantAction | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const isPending = approve.isPending || cancelMission.isPending;

  async function executeAction() {
    if (!pending) return;
    setError(null);
    try {
      if (pending.type === "approve") {
        await approve.mutateAsync(pending.escrowId);
      } else {
        await cancelMission.mutateAsync({
          escrowId: pending.escrowId,
          reason: "ADVERTISER_REJECT" satisfies MissionCancelReason,
        });
      }
      setPending(null);
    } catch (e) {
      setError(e instanceof BffError ? e.message : "처리에 실패했습니다.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">캠페인 관리</h1>
          <p className="text-muted-foreground">
            지원 블로거 미션 승인·거절 (BFF 연동)
          </p>
        </div>
        <Button disabled>캠페인 만들기</Button>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>캠페인명</TableHead>
              <TableHead>지원자</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.title}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Badge variant="secondary">대기 {campaign.pending}</Badge>
                    <Badge variant="outline">승인 {campaign.approved}</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger render={<Button variant="outline" size="sm" />}>
                      지원자 관리
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{campaign.title}</DialogTitle>
                      </DialogHeader>
                      <ul className="space-y-3">
                        {campaign.applicants.map((applicant) => (
                          <li
                            key={applicant.escrowId}
                            className="flex items-center justify-between gap-3 rounded-lg border p-3"
                          >
                            <div className="min-w-0">
                              <p className="font-medium">{applicant.name}</p>
                              <p className="truncate text-xs text-muted-foreground">
                                {applicant.url}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                미션: {applicant.missionStatus}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-2">
                              {applicant.missionStatus === "SUBMITTED" ? (
                                <>
                                  <Button
                                    size="sm"
                                    disabled={isPending}
                                    onClick={() =>
                                      setPending({
                                        type: "approve",
                                        campaignTitle: campaign.title,
                                        name: applicant.name,
                                        url: applicant.url,
                                        escrowId: applicant.escrowId,
                                      })
                                    }
                                  >
                                    승인
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={isPending}
                                    onClick={() => {
                                      setRejectNote("");
                                      setPending({
                                        type: "reject",
                                        campaignTitle: campaign.title,
                                        name: applicant.name,
                                        url: applicant.url,
                                        escrowId: applicant.escrowId,
                                      });
                                    }}
                                  >
                                    제출 거절
                                  </Button>
                                </>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  —
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
        title={
          pending?.type === "approve"
            ? "미션을 승인할까요?"
            : "제출을 거절할까요?"
        }
        description={
          pending?.type === "approve"
            ? "승인 시 정산이 진행됩니다."
            : "블로거 미지급, 잠긴 금액은 예치금으로 돌아갑니다."
        }
        confirmLabel={pending?.type === "approve" ? "승인하기" : "제출 거절"}
        variant={pending?.type === "reject" ? "destructive" : "default"}
        loading={isPending}
        onConfirm={executeAction}
        reason={pending?.type === "reject" ? rejectNote : ""}
        onReasonChange={
          pending?.type === "reject" ? setRejectNote : undefined
        }
        reasonLabel="거절 메모 (내부용)"
      >
        {pending ? (
          <>
            <ConfirmRow label="캠페인" value={pending.campaignTitle} />
            <ConfirmRow label="블로거" value={pending.name} />
            <ConfirmRow label="제출 URL" value={pending.url} />
          </>
        ) : null}
      </ConfirmDialog>
    </div>
  );
}
