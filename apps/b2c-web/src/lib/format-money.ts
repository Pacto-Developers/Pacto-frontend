/** 금액 표시·입력 (은행 앱 스타일 천 단위 구분) */
export function formatKRW(amount: number, options?: { suffix?: boolean }): string {
  const formatted = amount.toLocaleString("ko-KR");
  return options?.suffix === false ? formatted : `${formatted}원`;
}

export function formatAmountInput(value: string): string {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("ko-KR");
}

export function parseAmountInput(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export function maskAccountNumber(account: string): string {
  const trimmed = account.replace(/\s/g, "");
  if (trimmed.length <= 4) return trimmed || "—";
  return `****${trimmed.slice(-4)}`;
}
