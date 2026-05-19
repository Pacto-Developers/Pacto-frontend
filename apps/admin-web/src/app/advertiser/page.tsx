import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";

export default function AdvertiserDashboardPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="광고주 대시보드"
        description="내 캠페인 성과와 리포트를 확인합니다."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="진행 중 캠페인" value="5" />
        <StatCard label="이번 달 노출" value="128K" hint="전월 대비 +18%" />
        <StatCard label="예산 소진율" value="62%" />
      </div>
    </div>
  );
}
