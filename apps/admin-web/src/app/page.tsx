import { getHomePathForRole } from "@pacto/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseRole, ROLE_COOKIE } from "@/lib/auth";

export default async function RootPage() {
  const cookieStore = await cookies();
  const role = parseRole(cookieStore.get(ROLE_COOKIE)?.value);

  if (!role) redirect("/login");
  redirect(getHomePathForRole(role));
}
