export type Campaign = {
  id: string;
  category: "맛집" | "뷰티" | "IT/테크";
  title: string;
  brand: string;
  reward: string;
  rewardAmount: number;
  current: number;
  total: number;
  image: string;
  deadline: string;
};

export const campaigns: Campaign[] = [
  {
    id: "1",
    category: "맛집",
    title: "강남역 팝업스토어 방문 리뷰",
    brand: "팝업하우스",
    reward: "50,000원",
    rewardAmount: 50000,
    current: 23,
    total: 50,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    deadline: "D-3",
  },
  {
    id: "2",
    category: "뷰티",
    title: "스킨케어 2주 루틴 체험기",
    brand: "뷰티랩",
    reward: "80,000원",
    rewardAmount: 80000,
    current: 41,
    total: 50,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
    deadline: "D-5",
  },
  {
    id: "3",
    category: "IT/테크",
    title: "무선 이어폰 사용 후기",
    brand: "사운드웨이브",
    reward: "120,000원",
    rewardAmount: 120000,
    current: 12,
    total: 30,
    image: "https://images.unsplash.com/photo-1590658268037-6bfad787b970?w=800&q=80",
    deadline: "D-7",
  },
  {
    id: "4",
    category: "맛집",
    title: "신메뉴 시식단 모집",
    brand: "카페모아",
    reward: "제품 제공",
    rewardAmount: 0,
    current: 8,
    total: 20,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    deadline: "D-2",
  },
];

export const missionGuidelines = [
  "필수 키워드 3개 포함",
  "사진 5장 이상 첨부",
  "방문 인증샷 1장 필수",
];

export type Mission = {
  id: string;
  title: string;
  brand: string;
  status: "LOCKED" | "IN_PROGRESS" | "DONE";
  reward: string;
};

export const missions: Mission[] = [
  {
    id: "m1",
    title: "강남역 팝업스토어 방문 리뷰",
    brand: "팝업하우스",
    status: "IN_PROGRESS",
    reward: "50,000원",
  },
];

export type WalletHistory = {
  id: string;
  date: string;
  title: string;
  amount: number;
  type: "deposit" | "withdraw";
};

export const walletHistory: WalletHistory[] = [
  {
    id: "h1",
    date: "05.19",
    title: "강남 맛집 뷰티 체험",
    amount: 50000,
    type: "deposit",
  },
  {
    id: "h2",
    date: "05.18",
    title: "출금 완료",
    amount: -50000,
    type: "withdraw",
  },
  {
    id: "h3",
    date: "05.15",
    title: "스킨케어 루틴 리뷰",
    amount: 80000,
    type: "deposit",
  },
];
