export const AUTH_COOKIE = "pacto_b2c_auth";

export function isAuthenticated(cookieValue: string | undefined): boolean {
  return cookieValue === "1";
}
