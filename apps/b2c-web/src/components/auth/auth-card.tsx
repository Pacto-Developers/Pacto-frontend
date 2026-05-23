import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AuthCardProps = {
  children: ReactNode;
  title?: string;
  className?: string;
};

export function AuthCard({ children, title, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      {title && (
        <h2 className="mb-6 text-center text-base font-semibold text-foreground">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
