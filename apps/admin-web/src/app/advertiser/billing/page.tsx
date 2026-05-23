import { ChargeSection } from "@/components/billing/charge-section";
import { Suspense } from "react";

export default function AdvertiserBillingPage() {
  return (
    <div className="p-8">
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">결제 화면 로딩 중…</p>
        }
      >
        <ChargeSection />
      </Suspense>
    </div>
  );
}
