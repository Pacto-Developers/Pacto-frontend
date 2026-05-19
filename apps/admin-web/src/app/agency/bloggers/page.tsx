import { PageHeader } from "@/components/page-header";

export default function AgencyBloggersPage() {
  return (
    <div className="p-8">
      <PageHeader title="블로거 풀" description="매칭 후보 및 히스토리" />
      <p className="text-slate-600">블로거 목록·필터가 여기에 연결됩니다.</p>
    </div>
  );
}
