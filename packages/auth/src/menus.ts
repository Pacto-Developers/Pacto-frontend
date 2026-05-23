import type { Role } from "@pacto/types";

export type NavItem = {
  label: string;
  href: string;
  icon?: string;
};

const agencyMenus: NavItem[] = [
  { label: "대시보드", href: "/agency" },
  { label: "캠페인 관리", href: "/agency/campaigns" },
  { label: "블로거 풀", href: "/agency/bloggers" },
  { label: "정산", href: "/agency/settlements" },
];

const advertiserMenus: NavItem[] = [
  { label: "대시보드", href: "/advertiser" },
  { label: "내 캠페인", href: "/advertiser/campaigns" },
  { label: "에스크로·미션", href: "/advertiser/escrows" },
  { label: "리포트", href: "/advertiser/reports" },
  { label: "결제", href: "/advertiser/billing" },
];

export function getMenusForRole(role: Role): NavItem[] {
  return role === "agency" ? agencyMenus : advertiserMenus;
}

export function getHomePathForRole(role: Role): string {
  return role === "agency" ? "/agency" : "/advertiser";
}
