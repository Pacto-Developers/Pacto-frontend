/** B2C 모바일 앱 셸 최대 너비 (PC에서는 좌우 레터박스) */
export const MOBILE_APP_MAX_WIDTH_PX = 480;

/** PC 좌우 레터박스 배경 (앱 배경보다 한 톤 어둡게) */
export const LETTERBOX_BG = "#e5e8eb";

export const letterboxBgClass = "bg-[#e5e8eb]" as const;

export const mobileShellClass =
  "mx-auto w-full max-w-[480px]" as const;

export const mobileFixedClass =
  "fixed left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2" as const;
