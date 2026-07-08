import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  display?: LogoDisplay;
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}

export function Logo({
  display = "full",
  size = "md",
  className,
  priority = false,
}: LogoProps) {
  const isMark = display === "mark";
  const src = `${isMark ? siteConfig.brand.logoWhiteMark : siteConfig.brand.logoWhite}?v=5`;
  const width = isMark ? siteConfig.brand.markWidth : siteConfig.brand.width;
  const height = isMark ? siteConfig.brand.markHeight : siteConfig.brand.height;

  return (
    <span className="inline-flex [color-scheme:only_light]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={siteConfig.name}
        width={width}
        height={height}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={cn(
          "w-auto object-contain [forced-color-adjust:none]",
          isMark ? MARK_SIZE_CLASSES[size] : FULL_SIZE_CLASSES[size],
          className
        )}
      />
    </span>
  );
}

interface LogoLinkProps extends LogoProps {
  href?: string;
}

export function LogoLink({ href = "/", className, ...props }: LogoLinkProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label={`${siteConfig.name} - Home`}
    >
      <Logo {...props} />
    </Link>
  );
}
