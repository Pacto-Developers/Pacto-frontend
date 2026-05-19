import { PageHeader } from "@/components/page-header";

export default function AgencySettlementsPage() {
  return (
    <div className="p-8">
      <PageHeader title="정산" description="지급 예정·완료 내역" />
      <p className="text-slate-600">정산 테이블 UI가 여기에 연결됩니다.</p>
    </div>
  );
}
