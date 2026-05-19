"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const presets = [
  { value: 100000, label: "+10만 원" },
  { value: 500000, label: "+50만 원" },
  { value: 1000000, label: "+100만 원" },
] as const;

export function ChargeSection() {
  const [chargeAmount, setChargeAmount] = useState(0);
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const balance = 2500000;
  const lockedBalance = 500000;

  const handlePreset = (value: number) => {
    setChargeAmount((prev) => prev + value);
  };

  const handleCharge = () => {
    setIsPaymentPending(true);
    setTimeout(() => setIsPaymentPending(false), 1500);
  };

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
          <p className="text-3xl font-bold tabular-nums">
            {balance.toLocaleString()}원
          </p>
          <p className="text-sm text-muted-foreground">
            에스크로 잠금 · {lockedBalance.toLocaleString()}원
          </p>
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
          <Button
            className="w-full"
            size="lg"
            disabled={chargeAmount === 0}
            onClick={handleCharge}
          >
            {isPaymentPending
              ? "결제 처리 중..."
              : `${chargeAmount.toLocaleString()}원 충전하기`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
