import { Card } from "@/components/ui/Card";
import type { Service } from "@/data/services";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="flex h-full flex-col border-surface-border transition-colors duration-300 group-hover:border-accent/40">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted transition-colors group-hover:bg-accent/20">
          <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-accent">
          {service.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-white/50">
          {service.shortDescription}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
          View service
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </Card>
    </Link>
  );
}
