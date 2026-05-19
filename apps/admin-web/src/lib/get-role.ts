import type { Role } from "@pacto/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseRole, ROLE_COOKIE } from "@/lib/auth";

export async function getRequiredRole(): Promise<Role> {
  const cookieStore = await cookies();
  const role = parseRole(cookieStore.get(ROLE_COOKIE)?.value);
  if (!role) redirect("/login");
  return role;
}
