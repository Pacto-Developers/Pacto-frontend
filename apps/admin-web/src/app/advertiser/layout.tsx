import { getHomePathForRole, getMenusForRole } from "@pacto/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { getRequiredRole } from "@/lib/get-role";

export default async function AdvertiserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getRequiredRole();
  if (role !== "advertiser") redirect(getHomePathForRole(role));

  const menus = getMenusForRole(role);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role={role} menus={menus} />
      <div className="flex flex-1 flex-col overflow-auto">{children}</div>
    </div>
  );
}
