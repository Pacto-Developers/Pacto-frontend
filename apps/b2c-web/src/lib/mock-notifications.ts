export type NotificationType =
  | "settlement"
  | "mission"
  | "campaign"
  | "withdraw"
  | "system";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "settlement",
    title: "정산 완료",
    body: "강남 맛집 캠페인 보상 50,000원이 지갑에 들어왔어요.",
    time: "방금",
    read: false,
    href: "/wallet",
  },
  {
    id: "n2",
    type: "mission",
    title: "미션 검수 중",
    body: "아로마티카 리뷰 미션이 광고주 검수 단계예요.",
    time: "32분 전",
    read: false,
    href: "/missions",
  },
  {
    id: "n3",
    type: "campaign",
    title: "새 캠페인 추천",
    body: "뷰티 카테고리에 맞는 캠페인 3건이 올라왔어요.",
    time: "2시간 전",
    read: false,
    href: "/explore",
  },
  {
    id: "n4",
    type: "withdraw",
    title: "출금 접수",
    body: "출금 신청 30,000원이 처리 중(PENDING)이에요.",
    time: "어제",
    read: true,
    href: "/wallet",
  },
  {
    id: "n5",
    type: "system",
    title: "에스크로 안내",
    body: "미션 보상은 광고주 승인 후 에스크로에서 정산돼요.",
    time: "3일 전",
    read: true,
  },
];
