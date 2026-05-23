import { MoneyAmount } from "@/components/trust/money-amount";
import type { WalletHistory } from "@/lib/mock-data";

type TransactionRowProps = {
  item: WalletHistory;
};

export function TransactionRow({ item }: TransactionRowProps) {
  const isDeposit = item.type === "deposit";

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="min-w-0 pr-3">
        <p className="text-xs text-muted-foreground">{item.date}</p>
        <p className="truncate font-medium">{item.title}</p>
      </div>
      <MoneyAmount
        amount={item.amount}
        size="sm"
        signed
        variant={isDeposit ? "positive" : "negative"}
      />
    </div>
  );
}
