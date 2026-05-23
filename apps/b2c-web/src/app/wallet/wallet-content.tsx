"use client";

import {
  ConfirmRow,
  ConfirmSheet,
} from "@/components/trust/confirm-sheet";
import { EmptyState } from "@/components/trust/empty-state";
import { MoneyAmount } from "@/components/trust/money-amount";
import { TransactionRow } from "@/components/trust/transaction-row";
import { TrustNotice } from "@/components/trust/trust-notice";
import { getAppPageHeaderOffset } from "@/components/mobile/app-page-header.constants";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BffError } from "@/lib/api/bff";
import { useNotifications } from "@/components/notifications/notification-context";
import {
  useWalletBalance,
  useWalletHistories,
  useWithdrawWallet,
} from "@/lib/api/hooks";
import {
  formatAmountInput,
  formatKRW,
  maskAccountNumber,
  parseAmountInput,
} from "@/lib/format-money";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

const filters = ["전체", "입금", "출금"] as const;
const MIN_WITHDRAW = 10_000;

export function WalletContent() {
  const [filter, setFilter] = useState<string>("전체");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const { pushNotification } = useNotifications();
  const { data: balanceResult, isLoading: balanceLoading } = useWalletBalance();
  const { data: historiesResult, isLoading: historiesLoading } =
    useWalletHistories();
  const withdraw = useWithdrawWallet();

  const balance = balanceResult?.data.balance ?? 0;
  const lockedBalance = balanceResult?.data.lockedBalance ?? 0;
  const walletHistory = historiesResult?.data ?? [];
  const amount = parseAmountInput(amountInput);

  const items = useMemo(() => {
    if (filter === "전체") return walletHistory;
    if (filter === "입금")
      return walletHistory.filter((h) => h.type === "deposit");
    return walletHistory.filter((h) => h.type === "withdraw");
  }, [filter, walletHistory]);

  const isLoading = balanceLoading || historiesLoading;

  const canProceedToConfirm =
    amount >= MIN_WITHDRAW &&
    amount <= balance &&
    bankName.trim().length > 0 &&
    accountNumber.trim().length > 0;

  const withdrawError =
    withdraw.error instanceof BffError
      ? withdraw.error.message
      : withdraw.isError
        ? "출금 신청에 실패했습니다."
        : null;

  function resetWithdrawForm() {
    setAmountInput("");
    setBankName("");
    setAccountNumber("");
    withdraw.reset();
  }

  async function handleConfirmWithdraw() {
    if (withdrawPassword.length < 4) return;

    await withdraw.mutateAsync({
      amount,
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
    });

    pushNotification({
      type: "withdraw",
      title: "출금 신청 접수",
      body: `${formatKRW(amount)} 출금 신청이 처리 중이에요.`,
      time: "방금",
      href: "/wallet",
    });

    setConfirmOpen(false);
    setShowWithdraw(false);
    setWithdrawSuccess(true);
    resetWithdrawForm();
    setWithdrawPassword("");
  }

  return (
    <div className="min-h-full bg-[#f2f4f6]">
      <MobileHeader title="내 지갑" />

      <div style={{ paddingTop: getAppPageHeaderOffset() }}>
        <Card className="mx-4 mt-2 rounded-2xl border-0 bg-primary py-6 text-primary-foreground shadow-none ring-0">
          <CardContent className="space-y-4 px-5">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-primary-foreground/80">출금 가능</p>
                {balanceLoading ? (
                  <Loader2 className="mt-2 size-8 animate-spin" />
                ) : (
                  <p className="text-3xl font-bold tabular-nums">
                    {formatKRW(balance)}
                  </p>
                )}
              </div>
              <div className="border-t border-primary-foreground/15 pt-3">
                <p className="text-xs text-primary-foreground/70">
                  에스크로 잠금
                </p>
                <p className="text-sm font-medium tabular-nums text-primary-foreground/90">
                  {formatKRW(lockedBalance)}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-primary-foreground/60">
                  진행 중인 미션 보상은 승인 전까지 잠겨 있어요
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="w-full rounded-xl bg-white text-primary hover:bg-white/90"
              onClick={() => {
                withdraw.reset();
                setWithdrawSuccess(false);
                setShowWithdraw((v) => !v);
              }}
            >
              {showWithdraw ? "닫기" : "출금 신청하기"}
            </Button>
          </CardContent>
        </Card>

        {withdrawSuccess ? (
          <div className="mx-4 mt-3">
            <TrustNotice>
              출금 신청을 받았어요. 처리 중이며, 완료되면 내역에 반영돼요.
            </TrustNotice>
          </div>
        ) : null}

        {showWithdraw ? (
          <Card className="mx-4 mt-3 rounded-2xl border-0 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ring-0">
            <CardContent className="space-y-4 px-5 py-5">
              <div>
                <h3 className="font-semibold">출금 신청</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  최소 {formatKRW(MIN_WITHDRAW)} · 신청 후 처리 중(PENDING) 상태로
                  접수돼요
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="withdraw-amount"
                    className="text-sm font-medium"
                  >
                    출금 금액
                  </label>
                  <Input
                    id="withdraw-amount"
                    inputMode="numeric"
                    placeholder="10,000"
                    value={amountInput}
                    onChange={(e) =>
                      setAmountInput(formatAmountInput(e.target.value))
                    }
                    className="h-12 rounded-xl border-0 bg-[#f2f4f6] ring-1 ring-foreground/8"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-lg"
                      onClick={() =>
                        setAmountInput(formatAmountInput(String(MIN_WITHDRAW)))
                      }
                    >
                      +1만
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-lg"
                      onClick={() =>
                        setAmountInput(formatAmountInput(String(balance)))
                      }
                    >
                      전액
                    </Button>
                  </div>
                  {amount > 0 && amount < MIN_WITHDRAW ? (
                    <p className="text-xs text-destructive">
                      최소 {formatKRW(MIN_WITHDRAW)} 이상 입력해 주세요.
                    </p>
                  ) : null}
                  {amount > balance ? (
                    <p className="text-xs text-destructive">
                      출금 가능 금액보다 많을 수 없어요.
                    </p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="bank-name" className="text-sm font-medium">
                    입금 은행
                  </label>
                  <Input
                    id="bank-name"
                    placeholder="예: 국민은행"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="h-12 rounded-xl border-0 bg-[#f2f4f6] ring-1 ring-foreground/8"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="account-number"
                    className="text-sm font-medium"
                  >
                    계좌번호
                  </label>
                  <Input
                    id="account-number"
                    inputMode="numeric"
                    placeholder="- 없이 입력"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="h-12 rounded-xl border-0 bg-[#f2f4f6] ring-1 ring-foreground/8"
                  />
                </div>

                {withdrawError ? (
                  <p className="text-sm text-destructive">{withdrawError}</p>
                ) : null}

                <Button
                  type="button"
                  className="h-12 w-full rounded-xl bg-primary font-semibold"
                  disabled={!canProceedToConfirm}
                  onClick={() => setConfirmOpen(true)}
                >
                  출금 내용 확인하기
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="space-y-3 px-4 py-5">
          <h2 className="text-base font-semibold">포인트 내역</h2>

          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="w-full">
              {filters.map((f) => (
                <TabsTrigger key={f} value={f} className="flex-1">
                  {f}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Card className="rounded-2xl border-0 py-0 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ring-0">
            <CardContent className="px-0 py-0">
              {isLoading ? (
                <div className="space-y-2 p-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-14 animate-pulse rounded-xl bg-[#f2f4f6]"
                    />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <EmptyState
                  className="shadow-none"
                  message="아직 내역이 없어요"
                  description="미션 정산이 완료되면 입금 내역이 표시돼요"
                  actionLabel="캠페인 찾기"
                  actionHref="/explore"
                />
              ) : (
                items.map((item, index) => (
                  <div key={`${item.id}-${index}`}>
                    {index > 0 && <Separator />}
                    <TransactionRow item={item} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmSheet
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setWithdrawPassword("");
        }}
        title="출금을 신청할까요?"
        description="본인 확인 후 신청이 접수돼요"
        confirmLabel="신청하기"
        loading={withdraw.isPending}
        confirmDisabled={withdrawPassword.length < 4}
        onConfirm={handleConfirmWithdraw}
      >
        <ConfirmRow label="출금 금액" value={formatKRW(amount)} emphasize />
        <ConfirmRow label="입금 은행" value={bankName.trim() || "—"} />
        <ConfirmRow
          label="계좌번호"
          value={maskAccountNumber(accountNumber)}
        />
        <ConfirmRow label="수수료" value="0원" />
        <ConfirmRow
          label="신청 후 잔액"
          value={formatKRW(Math.max(0, balance - amount))}
        />
        <div className="space-y-1.5 border-t border-foreground/5 pt-3">
          <label
            htmlFor="withdraw-password"
            className="text-sm font-medium text-foreground"
          >
            로그인 비밀번호
          </label>
          <Input
            id="withdraw-password"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호 4자 이상"
            value={withdrawPassword}
            onChange={(e) => setWithdrawPassword(e.target.value)}
            className="h-12 rounded-xl border-0 bg-[#f2f4f6] ring-1 ring-foreground/8"
          />
          <p className="text-[11px] text-muted-foreground">
            목업 재인증 · 실서비스에서는 서버 검증이 필요해요
          </p>
        </div>
      </ConfirmSheet>
    </div>
  );
}
