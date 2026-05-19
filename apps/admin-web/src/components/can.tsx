"use client";

import { can, type Permission } from "@pacto/auth";
import type { Role } from "@pacto/types";

type CanProps = {
  role: Role;
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function Can({ role, permission, children, fallback = null }: CanProps) {
  if (!can(role, permission)) return fallback;
  return children;
}
