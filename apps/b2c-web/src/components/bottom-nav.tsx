"use client";

import { cn } from "@/lib/utils";
import { Home, MessageCircle, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "홈", icon: Home },
  { href: "/explore", label: "탐색", icon: Search },
  { href: "/messages", label: "메시지", icon: MessageCircle },
  { href: "/profile", label: "프로필", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-slate-200 bg-white/95 backdrop-blur">
      <ul className="flex items-center justify-around px-2 py-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "text-indigo-600"
                    : "text-slate-500 hover:text-slate-800",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
