import { logo } from "@pacto/assets";
import { cn } from "@/lib/utils";
import Image from "next/image";

type PactoLogoProps = {
  className?: string;
  size?: number;
  priority?: boolean;
  alt?: string;
};

export function PactoLogo({
  className,
  size = 32,
  priority = false,
  alt = "Pacto",
}: PactoLogoProps) {
  return (
    <Image
      src={logo}
      alt={alt}
      width={size * 3}
      height={size}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
      style={{ width: size * 1.5, height: size*1.5 }}
    />
  );
}
