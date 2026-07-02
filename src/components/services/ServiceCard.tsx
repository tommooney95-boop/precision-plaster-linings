import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Service } from "@/data/services";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <Card className="flex h-full flex-col">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted">
        <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-white">{service.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/50">
        {service.shortDescription}
      </p>
      <ButtonLink
        href={`/services/${service.slug}`}
        variant="ghost"
        size="sm"
        className="mt-6 -ml-2 self-start px-2 text-accent hover:text-accent"
      >
        Learn More
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </ButtonLink>
    </Card>
  );
}
