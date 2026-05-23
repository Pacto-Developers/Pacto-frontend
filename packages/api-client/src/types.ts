/** 백엔드 공통 응답 래퍼 (api.md) */
export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T | null;
  timestamp?: string;
};

/** Auth API Role */
export type ApiRole = "BUSINESS" | "BLOGGER";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResult = {
  accessToken: string;
  refreshToken: string;
  role: ApiRole;
};

export type SignupBusinessRequest = {
  email: string;
  password: string;
  role: "BUSINESS";
  companyName: string;
  businessNumber: string;
  contactName: string;
  contactPhone: string;
};

export type SignupBloggerRequest = {
  email: string;
  password: string;
  role: "BLOGGER";
  nickname: string;
  blogUrl: string;
};

export type SignupResult = {
  userId: number;
  role: ApiRole;
};

export type UserMeBusiness = {
  id: number;
  email: string;
  role: "BUSINESS";
  companyName: string;
};

export type UserMeBlogger = {
  id: number;
  email: string;
  role: "BLOGGER";
  nickname: string;
  blogUrl: string;
};

export type UserMe = UserMeBusiness | UserMeBlogger;
