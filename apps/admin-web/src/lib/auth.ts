import type { Role } from "@pacto/types";
import { ROLES } from "@pacto/types";

export const ROLE_COOKIE = "pacto_role";

export function isValidRole(value: string | undefined): value is Role {
  return ROLES.includes(value as Role);
}

export function parseRole(value: string | undefined): Role | null {
  return isValidRole(value) ? value : null;
}
