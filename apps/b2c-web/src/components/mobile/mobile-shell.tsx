import { MOBILE_APP_MAX_WIDTH_PX, mobileShellClass } from "@/lib/mobile-layout";
import type { ReactNode } from "react";

type MobileShellProps = {
  children: ReactNode;
};

/** PC 뷰포트: 좌우 검정, 중앙 모바일 폭 콘텐츠 */
export function MobileShell({ children }: MobileShellProps) {
  return (
    <div
      className={`${mobileShellClass} relative flex min-h-dvh flex-col bg-[#f2f4f6] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]`}
      style={{ maxWidth: MOBILE_APP_MAX_WIDTH_PX }}
    >
      {children}
    </div>
  );
}
