"use client";

import type { Role } from "@pacto/types";
import { getMenusForRole } from "@pacto/auth";
import { useMemo } from "react";

export function useRole(role: Role) {
  const menus = useMemo(() => getMenusForRole(role), [role]);

  return { role, menus };
}
