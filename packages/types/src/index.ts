/** B2B 관리자 Role */
export type Role = "agency" | "advertiser";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export const ROLES: Role[] = ["agency", "advertiser"];

export const ROLE_LABELS: Record<Role, string> = {
  agency: "대행사",
  advertiser: "광고주",
};
