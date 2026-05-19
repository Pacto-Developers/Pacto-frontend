import { PageHeader } from "@/components/page-header";

export default function AgencyCampaignsPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="캠페인 관리"
        description="캠페인 생성·승인·진행 상태"
      />
      <p className="text-slate-600">캠페인 테이블 UI가 여기에 연결됩니다.</p>
    </div>
  );
}
