import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type LogoVariant = "default" | "reversed";
type LogoDisplay = "full" | "mark";
type LogoSize = "sm" | "md" | "lg" | "xl";

const FULL_SIZE_CLASSES: Record<LogoSize, string> = {
  sm: "h-9",
  md: "h-12",
  lg: "h-16",
  xl: "h-20",
};

/** Square crop container for the hexagon icon mark only */
const MARK_CONTAINER_CLASSES: Record<LogoSize, string> = {
  sm: "h-9 w-11",
  md: "h-11 w-14",
  lg: "h-14 w-[4.5rem]",
  xl: "h-16 w-20",
};

interface LogoProps {
  variant?: LogoVariant;
  display?: LogoDisplay;
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}

export function Logo({
  variant = "reversed",
  display = "full",
  size = "md",
  className,
  priority = false,
}: LogoProps) {
  const src =
    variant === "reversed"
      ? siteConfig.brand.logoReversed
      : siteConfig.brand.logo;

  if (display === "mark") {
    return (
      <span
        className={cn(
          "relative inline-block shrink-0 overflow-hidden",
          MARK_CONTAINER_CLASSES[size],
          className
        )}
      >
        <Image
          src={src}
          alt={siteConfig.name}
          width={siteConfig.brand.width * 2}
          height={siteConfig.brand.height * 2}
          className="absolute left-1/2 top-0 h-[200%] w-auto max-w-none -translate-x-1/2"
          priority={priority}
          unoptimized
        />
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={siteConfig.name}
      width={siteConfig.brand.width}
      height={siteConfig.brand.height}
      className={cn("w-auto object-contain", FULL_SIZE_CLASSES[size], className)}
      priority={priority}
      unoptimized
    />
  );
}

interface LogoLinkProps extends LogoProps {
  href?: string;
}

export function LogoLink({ href = "/", className, ...props }: LogoLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]",
        className
      )}
      aria-label={`${siteConfig.name} - Home`}
    >
      <Logo {...props} />
    </Link>
  );
}
