export const ACCESS_TOKEN_COOKIE = "pacto_b2c_access_token";
export const REFRESH_TOKEN_COOKIE = "pacto_b2c_refresh_token";

/** @deprecated ACCESS_TOKEN_COOKIE 사용 */
export const AUTH_COOKIE = ACCESS_TOKEN_COOKIE;

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
