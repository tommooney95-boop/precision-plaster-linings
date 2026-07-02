import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CTABanner } from "@/components/ui/CTABanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { createMetadata } from "@/lib/seo";
import { seoConfig } from "@/lib/seo-config";
import { siteConfig } from "@/lib/site-config";
import { Award, Clock, Shield, Users } from "lucide-react";
import Image from "next/image";

export const metadata = createMetadata({
  title: seoConfig.pages.about.title,
  description: seoConfig.pages.about.description,
  path: "/about",
});

const values = [
  {
    icon: Award,
    title: "Quality First",
    description:
      "Every project is completed to the highest standard. We don't cut corners — we deliver finishes that last.",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description:
      "Complete peace of mind with comprehensive public liability and workers compensation insurance.",
  },
  {
    icon: Clock,
    title: "On Time, Every Time",
    description:
      "We respect your schedule. Our team works efficiently to meet deadlines without compromising quality.",
  },
  {
    icon: Users,
    title: "Experienced Team",
    description:
      "Our skilled plasterers bring years of experience across residential, commercial and insurance projects.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[50vh] items-center overflow-hidden pt-20">
        <Image
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=80"
          alt={`${siteConfig.name} plastering team working on a commercial construction project in ${siteConfig.location.regionName}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
        <div className="container-custom relative z-10 py-20">
          <Breadcrumbs items={[{ name: "About", href: "/about" }]} />
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            About Us
          </p>
          <h1 className="max-w-3xl text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {siteConfig.location.regionName}&apos;s Trusted Plastering Professionals
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/60">
            Delivering premium plastering services to homeowners, builders and
            commercial clients since day one.
          </p>
        </div>
      </section>

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Our Story"
                title="Built on Quality & Trust"
                align="left"
              />
              <div className="space-y-4 text-white/60">
                <p>
                  {siteConfig.name} was founded with a simple mission: deliver
                  plastering work that exceeds expectations, every single time.
                  Based in {siteConfig.location.suburb}, we&apos;ve built our
                  reputation on reliability, craftsmanship and honest communication.
                </p>
                <p>
                  From small patch repairs for homeowners to large-scale commercial
                  fit-outs, we treat every project with the same level of care and
                  attention to detail. Our experienced team works with builders,
                  renovators, property managers and insurance companies across{" "}
                  {siteConfig.location.serviceArea}.
                </p>
                <p>
                  We believe great plastering is invisible — seamless finishes
                  that make walls and ceilings look like they&apos;ve always been
                  perfect. That&apos;s the standard we hold ourselves to on every job.
                </p>
              </div>
              <ButtonLink href="/quote" className="mt-8">
                Request a Free Quote
              </ButtonLink>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1581094793769-4107200a6143?w=800&q=80"
                alt={`Professional plasterer applying gyprock finish to interior wall — ${siteConfig.location.serviceArea}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-padding bg-surface" delay={0.1}>
        <div className="container-custom">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="The Precision Plaster Difference"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-surface-border bg-surface-elevated p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted">
                    <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      <section className="section-padding">
        <div className="container-custom">
          <CTABanner
            title="Let's Work Together"
            description="Whether you're a homeowner, builder or property manager — we'd love to hear about your project."
          />
        </div>
      </section>
    </>
  );
}
