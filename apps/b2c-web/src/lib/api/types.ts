/** 백엔드 응답 DTO (필드명은 유연하게 매핑) */
export type ApiCampaign = {
  id?: string | number;
  campaignId?: string | number;
  title?: string;
  name?: string;
  brandName?: string;
  brand?: string;
  category?: string;
  categoryName?: string;
  rewardAmount?: number;
  reward?: number;
  point?: number;
  currentParticipants?: number;
  participantCount?: number;
  current?: number;
  maxParticipants?: number;
  capacity?: number;
  total?: number;
  thumbnailUrl?: string;
  imageUrl?: string;
  image?: string;
  status?: string;
  deadline?: string;
  endDate?: string;
  description?: string;
  missionGuide?: string;
  missionGuides?: string[];
  guidelines?: string[];
};

export type ApiMission = {
  id?: string | number;
  escrowId?: string | number;
  missionId?: string | number;
  title?: string;
  campaignTitle?: string;
  brandName?: string;
  brand?: string;
  status?: string;
  rewardAmount?: number;
  reward?: number | string;
};

export type ApiWalletBalance = {
  balance?: number;
  point?: number;
  amount?: number;
};

export type ApiWalletHistory = {
  id?: string | number;
  historyId?: string | number;
  date?: string;
  createdAt?: string;
  title?: string;
  description?: string;
  amount?: number;
  type?: string;
};

export type ApiUser = {
  id?: string | number;
  email?: string;
  name?: string;
  nickname?: string;
};

export type ApiLoginResponse = {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  user?: ApiUser;
};

export type DataSource = "api" | "mock";

export type WithSource<T> = {
  data: T;
  source: DataSource;
};
