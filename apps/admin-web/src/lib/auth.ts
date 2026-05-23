import type { Role } from "@pacto/types";
import { ROLES } from "@pacto/types";

export const ROLE_COOKIE = "pacto_role";
export const ACCESS_TOKEN_COOKIE = "pacto_admin_access_token";
export const REFRESH_TOKEN_COOKIE = "pacto_admin_refresh_token";

export function isValidRole(value: string | undefined): value is Role {
  return ROLES.includes(value as Role);
}

export function parseRole(value: string | undefined): Role | null {
  return isValidRole(value) ? value : null;
}

export function isAuthenticated(accessToken: string | undefined): boolean {
  return Boolean(accessToken?.length);
}

export const accessTokenCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export const refreshTokenCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 90,
};
