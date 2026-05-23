"use client";

import { ConfirmDialog, ConfirmRow } from "@/components/trust/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BffError } from "@/lib/api/bff";
import {
  useAdvertiserWallet,
  usePreparePayment,
} from "@/lib/api/hooks";
import { getAdvertiserPayment } from "@/lib/api/payments";
import {
  isPortOneConfigured,
  isPortOneV2Configured,
  openPortOnePayment,
} from "@/lib/portone";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const presets = [
  { value: 100000, label: "+10만 원" },
  { value: 500000, label: "+50만 원" },
  { value: 1000000, label: "+100만 원" },
] as const;

const MIN_CHARGE = 1000;

export function ChargeSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPaymentId = searchParams.get("paymentId");

  const { data: wallet, isLoading: walletLoading, refetch: refetchWallet } =
    useAdvertiserWallet();
  const preparePayment = usePreparePayment();

  const [chargeAmount, setChargeAmount] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const balance = wallet?.balance ?? 0;
  const lockedBalance = wallet?.lockedBalance ?? 0;

  useEffect(() => {
    if (!returnPaymentId) return;

    let cancelled = false;

    async function confirmReturnPayment(paymentId: string) {
      setIsPaymentPending(true);
      setMessage("결제 결과를 확인하는 중입니다…");

      try {
        const mockComplete = !isPortOneConfigured();
        const detail = await getAdvertiserPayment(paymentId, mockComplete);

        if (cancelled) return;

        if (detail.status === "PAID") {
          setMessage(
            `${detail.amount.toLocaleString()}원 충전이 완료되었습니다.`,
          );
          setChargeAmount(0);
          refetchWallet();
          router.replace("/advertiser/billing");
        } else {
          setError("결제가 아직 완료되지 않았습니다. 잠시 후 다시 확인해 주세요.");
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof BffError
              ? e.message
              : "결제 확인에 실패했습니다.",
          );
        }
      } finally {
        if (!cancelled) setIsPaymentPending(false);
      }
    }

    confirmReturnPayment(returnPaymentId);

    return () => {
      cancelled = true;
    };
  }, [returnPaymentId, refetchWallet, router]);

  const handlePreset = (value: number) => {
    setChargeAmount((prev) => prev + value);
    setError(null);
  };

  function openChargeConfirm() {
    setError(null);
    if (chargeAmount < MIN_CHARGE) {
      setError(`최소 ${MIN_CHARGE.toLocaleString()}원 이상 충전할 수 있습니다.`);
      return;
    }
    setConfirmOpen(true);
  }

  async function handleCharge() {
    setError(null);
    setMessage(null);
    setConfirmOpen(false);
    setIsPaymentPending(true);

    try {
      const prepared = await preparePayment.mutateAsync(chargeAmount);
      const redirectUrl = `${window.location.origin}/advertiser/billing?paymentId=${prepared.paymentId}`;

      if (!isPortOneConfigured()) {
        await getAdvertiserPayment(String(prepared.paymentId), true);
        setMessage(
          `${prepared.amount.toLocaleString()}원 충전이 완료되었습니다. (데모)`,
        );
        setChargeAmount(0);
        refetchWallet();
        return;
      }

      const result = await openPortOnePayment({
        merchantUid: prepared.merchantUid,
        amount: prepared.amount,
        orderName: "Pacto 예치금 충전",
        redirectUrl,
      });

      if (!result.success) {
        setError(result.message ?? "결제에 실패했습니다.");
        return;
      }

      if (isPortOneV2Configured()) {
        setMessage("결제 완료 후 이 페이지로 돌아오면 잔액이 갱신됩니다.");
        return;
      }

      const detail = await pollPayment(String(prepared.paymentId));
      if (detail.status === "PAID") {
        setMessage(
          `${detail.amount.toLocaleString()}원 충전이 완료되었습니다.`,
        );
        setChargeAmount(0);
        refetchWallet();
      }
    } catch (e) {
      setError(
        e instanceof BffError
          ? e.message
          : e instanceof Error
            ? e.message
            : "충전 요청에 실패했습니다.",
      );
    } finally {
      setIsPaymentPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          얼마를 충전할까요?
        </h1>
        <p className="mt-1 text-muted-foreground">
          예치금으로 캠페인 예산을 안전하게 관리하세요.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-muted-foreground">
            현재 잔액
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {walletLoading ? (
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <p className="text-3xl font-bold tabular-nums">
                {balance.toLocaleString()}원
              </p>
              <p className="text-sm text-muted-foreground">
                에스크로 잠금 · {lockedBalance.toLocaleString()}원
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>충전 금액</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            min={0}
            value={chargeAmount || ""}
            onChange={(e) => setChargeAmount(Number(e.target.value) || 0)}
            placeholder="충전할 금액을 입력하세요"
            className="text-lg font-semibold tabular-nums"
          />
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.value}
                type="button"
                variant="outline"
                onClick={() => handlePreset(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
          {message ? (
            <p className="text-sm text-primary">{message}</p>
          ) : null}

          <Button
            className="w-full"
            size="lg"
            disabled={chargeAmount < MIN_CHARGE || isPaymentPending}
            onClick={openChargeConfirm}
          >
            {isPaymentPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                결제 처리 중…
              </>
            ) : (
              `${chargeAmount.toLocaleString()}원 충전하기`
            )}
          </Button>

          {process.env.NODE_ENV === "development" ? (
            <p className="text-center text-xs text-muted-foreground">
              {isPortOneConfigured()
                ? "PortOne 연동 · webhook은 백엔드 처리"
                : "개발 모드: 데모 충전 즉시 반영"}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="예치금을 충전할까요?"
        description="결제 완료 후 캠페인 예산으로 사용할 수 있습니다."
        confirmLabel="결제 진행"
        loading={isPaymentPending}
        onConfirm={handleCharge}
      >
        <ConfirmRow
          label="충전 금액"
          value={`${chargeAmount.toLocaleString()}원`}
          emphasize
        />
        <ConfirmRow
          label="충전 후 가용 잔액"
          value={`${(balance + chargeAmount).toLocaleString()}원`}
        />
        <ConfirmRow
          label="현재 에스크로 잠금"
          value={`${lockedBalance.toLocaleString()}원`}
        />
      </ConfirmDialog>
    </div>
  );
}

async function pollPayment(paymentId: string, attempts = 8) {
  for (let i = 0; i < attempts; i++) {
    const detail = await getAdvertiserPayment(paymentId);
    if (detail.status === "PAID") return detail;
    await new Promise((r) => setTimeout(r, 1500));
  }
  return getAdvertiserPayment(paymentId);
}
