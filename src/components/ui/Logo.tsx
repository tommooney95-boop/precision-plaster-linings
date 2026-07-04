import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type LogoVariant = "default" | "reversed";
type LogoSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<LogoSize, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-14",
  xl: "h-20",
};

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}

export function Logo({
  variant = "reversed",
  size = "md",
  className,
  priority = false,
}: LogoProps) {
  const src =
    variant === "reversed"
      ? siteConfig.brand.logoReversed
      : siteConfig.brand.logo;

  return (
    <Image
      src={src}
      alt={siteConfig.name}
      width={siteConfig.brand.width}
      height={siteConfig.brand.height}
      className={cn("w-auto object-contain", SIZE_CLASSES[size], className)}
      priority={priority}
    />
  );
}

interface LogoLinkProps extends LogoProps {
  href?: string;
}

export function LogoLink({ href = "/", ...props }: LogoLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center"
      aria-label={`${siteConfig.name} - Home`}
    >
      <Logo {...props} />
    </Link>
  );
}
