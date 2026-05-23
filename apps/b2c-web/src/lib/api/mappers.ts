import type { Campaign, Mission, WalletHistory } from "@/lib/mock-data";
import type { ApiCampaign, ApiMission, ApiWalletHistory } from "./types";

const CATEGORY_MAP: Record<string, Campaign["category"]> = {
  맛집: "맛집",
  FOOD: "맛집",
  RESTAURANT: "맛집",
  뷰티: "뷰티",
  BEAUTY: "뷰티",
  "IT/테크": "IT/테크",
  IT: "IT/테크",
  TECH: "IT/테크",
  TECHNOLOGY: "IT/테크",
};

function mapCategory(raw?: string): Campaign["category"] {
  if (!raw) return "맛집";
  return CATEGORY_MAP[raw] ?? CATEGORY_MAP[raw.toUpperCase()] ?? "맛집";
}

function formatReward(amount: number): string {
  if (amount <= 0) return "제품 제공";
  return `${amount.toLocaleString()} P`;
}

function formatDeadline(
  raw?: string,
  status?: string,
  dDay?: number,
): string {
  if (status?.toUpperCase() === "CLOSED" || status?.toUpperCase() === "ENDED") {
    return "마감";
  }
  if (typeof dDay === "number") {
    if (dDay <= 0) return "마감";
    return `D-${dDay}`;
  }
  if (!raw) return "D-7";
  if (raw.startsWith("D-")) return raw;
  const end = new Date(raw);
  if (Number.isNaN(end.getTime())) return raw;
  const diff = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "마감";
  return `D-${diff}`;
}

export function mapApiCampaign(dto: ApiCampaign): Campaign {
  const id = String(dto.id ?? dto.campaignId ?? dto.campaign_id ?? "");
  const title = dto.title ?? dto.name ?? "캠페인";
  const brand = dto.brandName ?? dto.brand ?? "";
  const rewardAmount =
    dto.rewardAmount ?? dto.reward_point ?? dto.reward ?? dto.point ?? 0;
  const total = dto.maxParticipants ?? dto.total_slots ?? dto.capacity ?? dto.total ?? 1;
  const current =
    dto.remaining_slots !== undefined
      ? total - dto.remaining_slots
      : (dto.currentParticipants ?? dto.participantCount ?? dto.current ?? 0);

  return {
    id,
    category: mapCategory(dto.category ?? dto.categoryName),
    title,
    brand,
    reward: formatReward(rewardAmount),
    rewardAmount,
    current,
    total: total || 1,
    image:
      dto.thumbnailUrl ??
      dto.imageUrl ??
      dto.image ??
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    deadline: formatDeadline(
      dto.deadline ?? dto.endDate,
      dto.status,
      dto.d_day,
    ),
  };
}

export function mapApiMission(dto: ApiMission): Mission {
  const id = String(
    dto.escrowId ?? dto.escrow_id ?? dto.id ?? dto.missionId ?? "",
  );
  const rewardAmount =
    typeof dto.reward === "number"
      ? dto.reward
      : (dto.rewardAmount ?? dto.reward_point ?? dto.rewardPoint ?? 0);

  return {
    id,
    title: dto.title ?? dto.campaignTitle ?? "미션",
    brand: dto.brandName ?? dto.brand ?? "",
    status: mapMissionStatus(dto.status),
    reward:
      typeof dto.reward === "string"
        ? dto.reward
        : rewardAmount > 0
          ? `${rewardAmount.toLocaleString()}원`
          : "—",
  };
}

function mapMissionStatus(raw?: string): Mission["status"] {
  const s = raw?.toUpperCase() ?? "";
  if (["RELEASED", "DONE", "COMPLETED", "APPROVED", "FINISHED"].includes(s)) {
    return "DONE";
  }
  if (["SUBMITTED", "IN_PROGRESS", "ACTIVE", "PENDING_REVIEW"].includes(s)) {
    return "IN_PROGRESS";
  }
  if (s === "CANCELED" || s === "CANCELLED") return "CANCELED";
  return "LOCKED";
}

export function mapApiWalletHistory(dto: ApiWalletHistory): WalletHistory {
  const amount = dto.amount ?? 0;
  const apiType = dto.type?.toUpperCase() ?? "";
  const type =
    apiType === "REFUND" ||
    apiType === "WITHDRAW" ||
    (apiType !== "CHARGE" && apiType !== "RELEASE" && amount < 0)
      ? "withdraw"
      : "deposit";

  const dateRaw = dto.date ?? dto.createdAt;
  let date = "—";
  if (dateRaw) {
    const d = new Date(dateRaw);
    date = Number.isNaN(d.getTime())
      ? dateRaw
      : `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  }

  return {
    id: String(dto.id ?? dto.historyId ?? `h-${Date.now()}`),
    date,
    title: dto.title ?? dto.description ?? "포인트 변동",
    amount,
    type,
  };
}

export function extractMissionGuidelines(dto: ApiCampaign): string[] {
  if (Array.isArray(dto.missionGuides) && dto.missionGuides.length > 0) {
    return dto.missionGuides;
  }
  if (Array.isArray(dto.requirements) && dto.requirements.length > 0) {
    return dto.requirements;
  }
  if (Array.isArray(dto.guidelines) && dto.guidelines.length > 0) {
    return dto.guidelines;
  }
  if (dto.missionGuide) {
    return dto.missionGuide.split("\n").filter(Boolean);
  }
  return [];
}
