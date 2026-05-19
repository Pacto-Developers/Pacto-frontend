import { Can } from "@/components/can";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";

export default function AgencyDashboardPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="대행사 대시보드"
        description="캠페인·블로거·정산을 한곳에서 관리합니다."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="진행 중 캠페인" value="12" hint="전주 대비 +2" />
        <StatCard label="매칭 대기 블로거" value="34" />
        <StatCard label="이번 달 정산 예정" value="₩4.2M" />
      </div>
      <Can role="agency" permission="campaign:write">
        <p className="mt-8 rounded-lg border border-dashed border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          `Can` 컴포넌트: campaign:write 권한이 있는 Role만 이 안내가 보입니다.
        </p>
      </Can>
    </div>
  );
}
