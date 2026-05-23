import { EscrowManagement } from "@/components/campaigns/escrow-management";

export default function AgencySettlementsPage() {
  return (
    <div className="p-8">
      <EscrowManagement
        title="정산 · 에스크로"
        description="에스크로 잠금·정산·환불 내역 (데모/mock · 실 API는 광고주 전용)"
      />
    </div>
  );
}
