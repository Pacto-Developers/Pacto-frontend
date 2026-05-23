import { EscrowManagement } from "@/components/campaigns/escrow-management";

export default function AdvertiserEscrowsPage() {
  return (
    <div className="p-8">
      <EscrowManagement
        title="에스크로 · 미션"
        description="잠금 조회 · 제출 승인/거절 · 미제출 미션 예치금 반환"
      />
    </div>
  );
}
