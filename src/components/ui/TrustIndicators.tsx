import { siteConfig } from "@/lib/site-config";
import { Check } from "lucide-react";

export function TrustIndicators() {
  return (
    <ul
      className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
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
