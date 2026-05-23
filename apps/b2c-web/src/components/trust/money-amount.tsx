import { formatKRW } from "@/lib/format-money";
import { cn } from "@/lib/utils";

type MoneyAmountProps = {
  amount: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  signed?: boolean;
  variant?: "default" | "positive" | "negative";
};

const sizeClass = {
  sm: "text-base font-semibold",
  md: "text-2xl font-bold",
  lg: "text-3xl font-bold",
} as const;

export function MoneyAmount({
  amount,
  className,
  size = "md",
  signed = false,
  variant = "default",
}: MoneyAmountProps) {
  const prefix = signed && amount > 0 ? "+" : signed && amount < 0 ? "" : "";
  const variantClass =
    variant === "positive"
      ? "text-primary"
      : variant === "negative"
        ? "text-foreground"
        : "text-foreground";

  return (
    <span
      className={cn("tabular-nums", sizeClass[size], variantClass, className)}
      aria-label={formatKRW(Math.abs(amount))}
    >
      {prefix}
      {formatKRW(amount)}
    </span>
  );
}
