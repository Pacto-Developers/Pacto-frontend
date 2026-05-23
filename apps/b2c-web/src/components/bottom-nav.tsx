"use client";

import { mobileFixedClass } from "@/lib/mobile-layout";
import { cn } from "@/lib/utils";
import {
  ClipboardCheck,
  Compass,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/explore", label: "탐색", icon: Compass },
  { href: "/missions", label: "진행중", icon: ClipboardCheck },
  { href: "/wallet", label: "지갑", icon: Wallet },
  { href: "/profile", label: "프로필", icon: User },
] as const;

const hiddenPaths = ["/", "/login", "/signup"];
const hiddenPrefixes = ["/campaigns/"];

function shouldHideNav(pathname: string): boolean {
  if (hiddenPaths.includes(pathname)) return true;
  return hiddenPrefixes.some((p) => pathname.startsWith(p));
}

export function BottomNav() {
  const pathname = usePathname();

  if (shouldHideNav(pathname)) {
    return null;
  }

  return (
    <nav
      className={cn(
        mobileFixedClass,
        "bottom-0 flex min-h-[72px] items-center justify-around rounded-t-2xl bg-white px-6 pb-[env(safe-area-inset-bottom,0px)] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]",
      )}
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex h-full w-16 flex-col items-center justify-center rounded-xl transition-colors",
              active
                ? "scale-90 font-bold text-primary"
                : "text-[#586373] hover:bg-[#eceef0]",
            )}
          >
            <Icon
              className="mb-1 size-7"
              strokeWidth={active ? 2.5 : 2}
              fill={active ? "currentColor" : "none"}
            />
            <span className="text-[11px] leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
