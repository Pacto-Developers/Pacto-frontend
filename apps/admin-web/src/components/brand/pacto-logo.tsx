import { logo } from "@pacto/assets";
import { cn } from "@/lib/utils";
import Image from "next/image";

type PactoLogoProps = {
  className?: string;
  size?: number;
  priority?: boolean;
  /** dark = 밝은 배경용(기본), light = 어두운 사이드바용 */
  variant?: "dark" | "light";
  alt?: string;
};

export function PactoLogo({
  className,
  size = 32,
  priority = false,
  variant = "dark",
  alt = "Pacto",
}: PactoLogoProps) {
  return (
    <Image
      src={logo}
      alt={alt}
      width={size * 3}
      height={size}
      priority={priority}
      className={cn(
        "h-auto w-auto object-contain",
        variant === "light" && "brightness-0 invert",
        className,
      )}
      style={{ width: size * 1.5, height: size*1.5 }}
    />
  );
}
