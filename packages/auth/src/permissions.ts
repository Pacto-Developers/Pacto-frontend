import type { Role } from "@pacto/types";

export type Permission =
  | "campaign:read"
  | "campaign:write"
  | "blogger:read"
  | "settlement:read"
  | "report:read"
  | "billing:read";

const rolePermissions: Record<Role, Permission[]> = {
  agency: [
    "campaign:read",
    "campaign:write",
    "blogger:read",
    "settlement:read",
  ],
  advertiser: ["campaign:read", "report:read", "billing:read"],
};

export function can(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function canAccessRoute(role: Role, pathname: string): boolean {
  if (pathname.startsWith("/agency")) return role === "agency";
  if (pathname.startsWith("/advertiser")) return role === "advertiser";
  return true;
}
