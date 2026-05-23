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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BffError } from "@/lib/api/bff";
import {
  useAdvertiserCampaigns,
  useCreateCampaign,
  useUpdateCampaignStatus,
} from "@/lib/api/hooks";
import type { CampaignStatus } from "@pacto/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const categories = ["맛집", "뷰티", "IT/테크"] as const;

const createSchema = z.object({
  title: z.string().min(1, "제목을 입력해 주세요"),
  description: z.string().min(1, "설명을 입력해 주세요"),
  category: z.enum(categories),
  reward_point: z.coerce.number().min(1, "보상 포인트를 입력해 주세요"),
  total_slots: z.coerce.number().min(1, "모집 인원을 입력해 주세요"),
  deadline: z.string().min(1, "마감 일시를 선택해 주세요"),
  requirementsText: z.string().optional(),
});

type CreateFormValues = z.infer<typeof createSchema>;

const statusLabel: Record<CampaignStatus, string> = {
  OPEN: "모집 중",
  CLOSED: "마감",
  CANCELED: "취소",
};

const statusVariant: Record<
  CampaignStatus,
  "default" | "secondary" | "outline"
> = {
  OPEN: "default",
  CLOSED: "secondary",
  CANCELED: "outline",
};

type PendingStatus = {
  campaignId: number;
  title: string;
  status: CampaignStatus;
};

export function AdvertiserCampaigns() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingCreate, setPendingCreate] = useState<CreateFormValues | null>(
    null,
  );
  const [pendingStatus, setPendingStatus] = useState<PendingStatus | null>(null);
  const { data: campaigns = [], isLoading, refetch } = useAdvertiserCampaigns();
  const createCampaign = useCreateCampaign();
  const updateStatus = useUpdateCampaignStatus();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "맛집",
      reward_point: 50000,
      total_slots: 10,
      deadline: "",
      requirementsText: "",
    },
  });

  function onCreateSubmit(values: CreateFormValues) {
    setPendingCreate(values);
  }

  async function executeCreate() {
    if (!pendingCreate) return;
    const values = pendingCreate;
    const requirements = values.requirementsText
      ?.split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      await createCampaign.mutateAsync({
        title: values.title,
        description: values.description,
        category: values.category,
        reward_point: values.reward_point,
        total_slots: values.total_slots,
        deadline: new Date(values.deadline).toISOString(),
        requirements: requirements?.length ? requirements : undefined,
      });
      reset();
      setDialogOpen(false);
      setPendingCreate(null);
    } catch (error) {
      setError("root", {
        message:
          error instanceof BffError
            ? error.message
            : "캠페인 등록에 실패했습니다.",
      });
      setPendingCreate(null);
    }
  }

  async function executeStatusChange() {
    if (!pendingStatus) return;
    try {
      await updateStatus.mutateAsync({
        campaignId: String(pendingStatus.campaignId),
        status: pendingStatus.status,
      });
      setPendingStatus(null);
    } catch {
      setPendingStatus(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">내 캠페인</h1>
          <p className="text-muted-foreground">
            캠페인 등록 · 모집 중단(CLOSED) · 취소(CANCELED)
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />}>캠페인 만들기</DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>새 캠페인</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit(onCreateSubmit)}>
              <Field label="제목" error={errors.title?.message}>
                <Input {...register("title")} placeholder="캠페인 제목" />
              </Field>
              <Field label="설명" error={errors.description?.message}>
                <Input {...register("description")} placeholder="상세 설명" />
              </Field>
              <Field label="카테고리" error={errors.category?.message}>
                <select
                  {...register("category")}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="보상 포인트"
                  error={errors.reward_point?.message}
                >
                  <Input
                    type="number"
                    {...register("reward_point")}
                  />
                </Field>
                <Field label="모집 인원" error={errors.total_slots?.message}>
                  <Input type="number" {...register("total_slots")} />
                </Field>
              </div>
              <Field label="마감 일시" error={errors.deadline?.message}>
                <Input type="datetime-local" {...register("deadline")} />
              </Field>
              <Field label="미션 요구사항 (줄바꿈)">
                <textarea
                  {...register("requirementsText")}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="인스타그램 피드 업로드&#10;해시태그 포함"
                />
              </Field>
              {errors.root ? (
                <p className="text-sm text-destructive">{errors.root.message}</p>
              ) : null}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || createCampaign.isPending}
              >
                {createCampaign.isPending ? "등록 중…" : "등록 내용 확인"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>캠페인</TableHead>
                <TableHead>보상</TableHead>
                <TableHead>슬롯</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-muted-foreground"
                  >
                    등록된 캠페인이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((campaign) => (
                  <TableRow key={campaign.campaign_id}>
                    <TableCell>
                      <p className="font-medium">{campaign.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {campaign.category} · D-{campaign.d_day}
                      </p>
                    </TableCell>
                    <TableCell>
                      {campaign.reward_point.toLocaleString()} P
                    </TableCell>
                    <TableCell>
                      {campaign.remaining_slots}/{campaign.total_slots}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[campaign.status]}>
                        {statusLabel[campaign.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.status === "OPEN" ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updateStatus.isPending}
                            onClick={() =>
                              setPendingStatus({
                                campaignId: campaign.campaign_id,
                                title: campaign.title,
                                status: "CLOSED",
                              })
                            }
                          >
                            마감
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updateStatus.isPending}
                            onClick={() =>
                              setPendingStatus({
                                campaignId: campaign.campaign_id,
                                title: campaign.title,
                                status: "CANCELED",
                              })
                            }
                          >
                            취소
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
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
        open={pendingCreate !== null}
        onOpenChange={(open) => {
          if (!open) setPendingCreate(null);
        }}
        title="캠페인을 등록할까요?"
        description="등록 시 예치금이 에스크로로 잠길 수 있어요"
        confirmLabel="등록하기"
        loading={createCampaign.isPending}
        onConfirm={executeCreate}
      >
        {pendingCreate ? (
          <>
            <ConfirmRow label="제목" value={pendingCreate.title} />
            <ConfirmRow label="카테고리" value={pendingCreate.category} />
            <ConfirmRow
              label="보상"
              value={`${pendingCreate.reward_point.toLocaleString()} P`}
              emphasize
            />
            <ConfirmRow
              label="모집"
              value={`${pendingCreate.total_slots}명`}
            />
            <ConfirmRow
              label="마감"
              value={new Date(pendingCreate.deadline).toLocaleString("ko-KR")}
            />
          </>
        ) : null}
      </ConfirmDialog>

      <ConfirmDialog
        open={pendingStatus !== null}
        onOpenChange={(open) => {
          if (!open) setPendingStatus(null);
        }}
        title={
          pendingStatus?.status === "CANCELED"
            ? "캠페인을 취소할까요?"
            : "캠페인 모집을 마감할까요?"
        }
        description={
          pendingStatus?.status === "CANCELED"
            ? "취소 후에는 되돌리기 어려울 수 있습니다."
            : "마감 후 신규 지원을 받지 않습니다."
        }
        confirmLabel={
          pendingStatus?.status === "CANCELED" ? "취소하기" : "마감하기"
        }
        variant={
          pendingStatus?.status === "CANCELED" ? "destructive" : "default"
        }
        loading={updateStatus.isPending}
        onConfirm={executeStatusChange}
      >
        {pendingStatus ? (
          <>
            <ConfirmRow label="캠페인" value={pendingStatus.title} />
            <ConfirmRow
              label="변경 상태"
              value={statusLabel[pendingStatus.status]}
            />
          </>
        ) : null}
      </ConfirmDialog>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
