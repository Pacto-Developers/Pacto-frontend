export const APP_PAGE_HEADER_HEIGHT = 56;
export const APP_PAGE_SECONDARY_HEIGHT = 48;

export function getAppPageHeaderOffset(hasSecondary = false): number {
  return hasSecondary
    ? APP_PAGE_HEADER_HEIGHT + APP_PAGE_SECONDARY_HEIGHT
    : APP_PAGE_HEADER_HEIGHT;
}
