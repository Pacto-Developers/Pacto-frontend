import { AppPageHeader } from "@/components/mobile/app-page-header";
import { getAppPageHeaderOffset } from "@/components/mobile/app-page-header.constants";

type MobileHeaderProps = {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
  variant?: "main" | "sub";
  showNotification?: boolean;
  notificationCount?: number;
  className?: string;
};

/** @deprecated subtitle는 무시됩니다. AppPageHeader와 동일한 탐색 헤더 스타일 */
export function MobileHeader({
  title,
  showBackButton = false,
  backHref = "/explore",
  variant,
  showNotification = true,
  notificationCount = 2,
  className,
}: MobileHeaderProps) {
  const layout = variant ?? (showBackButton ? "sub" : "main");

  return (
    <AppPageHeader
      title={title}
      variant={layout}
      backHref={backHref}
      showNotification={showNotification}
      notificationCount={notificationCount}
      className={className}
    />
  );
}

export { getAppPageHeaderOffset as getMobileHeaderOffset };
