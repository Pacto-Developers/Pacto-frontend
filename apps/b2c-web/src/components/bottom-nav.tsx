"use client";

import { cn } from "@/lib/utils";
import { ClipboardList, Search, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/explore", label: "탐색", icon: Search },
  { href: "/missions", label: "미션", icon: ClipboardList },
  { href: "/wallet", label: "지갑", icon: Wallet },
] as const;

const hiddenPrefixes = ["/campaigns/"];

export function BottomNav() {
  const pathname = usePathname();

  if (hiddenPrefixes.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-border/60 bg-white/95 backdrop-blur">
      <ul className="flex items-center justify-around px-2 py-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-4 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
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
