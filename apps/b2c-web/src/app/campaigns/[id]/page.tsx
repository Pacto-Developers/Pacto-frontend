import { CampaignDetailContent } from "./campaign-detail-content";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CampaignDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <CampaignDetailContent id={id} />;
}
