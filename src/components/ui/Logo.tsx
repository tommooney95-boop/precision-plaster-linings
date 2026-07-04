import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type LogoVariant = "default" | "reversed";
type LogoDisplay = "full" | "mark";
type LogoSize = "sm" | "md" | "lg" | "xl";

const FULL_SIZE_CLASSES: Record<LogoSize, string> = {
  sm: "h-10",
  md: "h-12",
  lg: "h-16",
  xl: "h-[4.5rem]",
};

const MARK_SIZE_CLASSES: Record<LogoSize, string> = {
  sm: "h-9",
  md: "h-11",
  lg: "h-14",
  xl: "h-16",
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
  const isReversed = variant === "reversed";
  const isMark = display === "mark";

  const src = isMark
    ? isReversed
      ? siteConfig.brand.logoMarkReversed
      : siteConfig.brand.logoMark
    : isReversed
      ? siteConfig.brand.logoReversed
      : siteConfig.brand.logo;

  const width = isMark ? siteConfig.brand.markWidth : siteConfig.brand.width;
  const height = isMark ? siteConfig.brand.markHeight : siteConfig.brand.height;

  return (
    <Image
      src={src}
      alt={siteConfig.name}
      width={width}
      height={height}
      className={cn(
        "w-auto object-contain",
        isMark ? MARK_SIZE_CLASSES[size] : FULL_SIZE_CLASSES[size],
        className
      )}
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
        "inline-flex shrink-0 items-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]",
        className
      )}
      aria-label={`${siteConfig.name} - Home`}
    >
      <Logo {...props} />
    </Link>
  );
}
