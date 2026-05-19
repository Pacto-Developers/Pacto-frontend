import { PactoLogo } from "@/components/brand/pacto-logo";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TAGLINE = "거래를 약속대로";

type PactoBrandProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** 스플래시 등 어두운 배경 */
  inverted?: boolean;
  showTagline?: boolean;
  priority?: boolean;
  href?: string;
};

const sizeMap = {
  sm: { logo: 20, name: "text-sm", tagline: "text-[10px]" },
  md: { logo: 28, name: "text-base", tagline: "text-xs" },
  lg: { logo: 40, name: "text-xl", tagline: "text-sm" },
} as const;

export function PactoBrand({
  className,
  size = "md",
  inverted = false,
  showTagline = true,
  priority = false,
  href,
}: PactoBrandProps) {
  const s = sizeMap[size];

  const content = (
    <div className={cn("flex items-center gap-1", className)}>
      <PactoLogo
        size={s.logo}
        priority={priority}
        className={cn(inverted && "brightness-0 invert")}
      />
      <div className="flex min-w-0 items-baseline gap-1 leading-none">
        <span
          className={cn(
            "shrink-0 font-bold tracking-tight",
            s.name,
            inverted ? "text-white" : "text-foreground",
          )}
        >
          Pacto
        </span>
        {showTagline && (
          <span
            className={cn(
              "truncate font-normal",
              s.tagline,
              inverted ? "text-white/55" : "text-muted-foreground",
            )}
          >
            {TAGLINE}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0" aria-label="Pacto 홈">
        {content}
      </Link>
    );
  }

  return content;
}
