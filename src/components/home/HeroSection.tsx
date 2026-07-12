"use client";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { TrustIndicators } from "@/components/ui/TrustIndicators";
import { useMounted } from "@/hooks/useMounted";
import { siteConfig } from "@/lib/site-config";
import { motion, useReducedMotion } from "framer-motion";
import { Phone } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  const mounted = useMounted();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
        alt={`Professional plastering and gyprock installation in ${siteConfig.location.regionName} — ${siteConfig.name}`}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />

      <div className="container-custom relative z-10 py-32 md:py-40">
        <motion.div
          initial={
            mounted && !prefersReducedMotion ? { opacity: 0, y: 30 } : false
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">
            {siteConfig.location.regionName}&apos;s Trusted Plasterer
          </p>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Professional Plastering Done Right The First Time
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
            Residential, commercial, renovations and repairs — clean finishes,
            honest quotes, and a reliable local team.
          </p>
          <p className="mt-3 text-sm font-medium uppercase tracking-wider text-white/40">
            Gyprock · Ceilings · Cornice · Patch &amp; insurance work
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/quote" size="lg">
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

          <div className="mt-12 border-t border-white/10 pt-8">
            <TrustIndicators align="left" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
