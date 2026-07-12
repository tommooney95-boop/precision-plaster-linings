import { ButtonLink } from "@/components/ui/ButtonLink";

import { siteConfig } from "@/lib/site-config";

import { cn } from "@/lib/utils";

import { Phone, FileText } from "lucide-react";



interface CTABannerProps {

  title?: string;

  description?: string;

  className?: string;

}



export function CTABanner({

  title = "Ready to Start Your Project?",

  description = `Get a free, no-obligation quote from ${siteConfig.location.regionName}'s trusted plastering professionals. We respond within 2 business days.`,

  className,

}: CTABannerProps) {

  return (

    <section

      className={cn(

        "relative overflow-hidden rounded-3xl border border-surface-border bg-surface-elevated",

        className

      )}

      aria-label="Call to action"

    >

      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />

      <div className="relative px-6 py-12 text-center md:px-12 md:py-16">

        <h2 className="text-balance text-2xl font-bold text-white md:text-3xl lg:text-4xl">

          {title}

        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">

          {description}

        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">

          <ButtonLink href="/quote" size="lg">

            <FileText className="h-5 w-5" aria-hidden="true" />

            Request a Free Quote

          </ButtonLink>

          <ButtonLink

            href={siteConfig.contact.phoneHref}

            variant="outline"

            size="lg"

          >

            <Phone className="h-5 w-5" aria-hidden="true" />

            Call {siteConfig.contact.phone}

          </ButtonLink>

        </div>

      </div>

    </section>

  );

}


