import Link from "next/link";

import { services, type Service } from "@/data/services";

import { seoConfig } from "@/lib/seo-config";

import { ArrowRight } from "lucide-react";



interface RelatedServicesProps {

  currentSlug: string;

  limit?: number;

}



export function RelatedServices({ currentSlug, limit = 3 }: RelatedServicesProps) {

  const related = services

    .filter((s) => s.slug !== currentSlug)

    .slice(0, limit);



  return (

    <section aria-labelledby="related-services-heading" className="mt-12">

      <h2 id="related-services-heading" className="mb-4 text-lg font-bold text-white">

        Related Plastering Services

      </h2>

      <ul className="grid gap-3 sm:grid-cols-3">

        {related.map((service: Service) => (

          <li key={service.slug}>

            <Link

              href={`/services/${service.slug}`}

              className="group flex items-center justify-between rounded-xl border border-surface-border bg-surface p-4 transition-all hover:border-accent/30 hover:bg-surface-elevated"

            >

              <span className="text-sm font-medium text-white/80 group-hover:text-white">

                {service.title}

              </span>

              <ArrowRight

                className="h-4 w-4 shrink-0 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-accent"

                aria-hidden="true"

              />

            </Link>

          </li>

        ))}

      </ul>

      <p className="mt-4 text-sm text-white/40">

        View all{" "}

        <Link href="/services" className="text-accent hover:underline">

          plastering services in {seoConfig.regionName}

        </Link>{" "}

        or{" "}

        <Link href="/quote" className="text-accent hover:underline">

          request a free quote

        </Link>

        .

      </p>

    </section>

  );

}


