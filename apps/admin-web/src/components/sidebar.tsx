"use client";

import type { NavItem } from "@pacto/auth";
import type { Role } from "@pacto/types";
import { ROLE_LABELS } from "@pacto/types";
import { cn } from "@/lib/utils";
import { PactoBrand } from "@/components/brand/pacto-brand";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  role: Role;
  menus: NavItem[];
};

export function Sidebar({ role, menus }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-slate-900 text-slate-100">
      <div className="border-b border-slate-700 px-5 py-6">
        <PactoBrand size="md" variant="light" href="/" />
        <p className="mt-1 text-xs text-slate-400">{ROLE_LABELS[role]} 뷰</p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menus.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <form
        action="/api/auth/logout"
        method="POST"
        className="border-t border-slate-700 p-3"
      >
        <button
          type="submit"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </form>
    </aside>
  );
}
