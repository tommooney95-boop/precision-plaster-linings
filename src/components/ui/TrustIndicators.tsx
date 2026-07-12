import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TrustIndicatorsProps {
  align?: "left" | "center";
  className?: string;
}

export function TrustIndicators({
  align = "center",
  className,
}: TrustIndicatorsProps) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-3",
        align === "center" ? "justify-center" : "justify-start",
        className
      )}
      aria-label="Trust indicators"
    >
      {siteConfig.trustIndicators.map((item) => (
        <li
          key={item}
          className="flex items-center gap-2 text-sm font-medium text-white/80 md:text-base"
        >
          <Check
            className="h-4 w-4 shrink-0 text-accent"
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
