import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/seo";
import { seoConfig } from "@/lib/seo-config";
import { siteConfig } from "@/lib/site-config";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export const metadata = createMetadata({
  title: seoConfig.pages.contact.title,
  description: seoConfig.pages.contact.description,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <section className="section-padding pt-32 md:pt-40">
        <div className="container-custom">
          <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />
          <SectionHeading
            eyebrow="Contact"
            title="Get in Touch"
            description="Ready to discuss your project? Reach out by phone, email or request a free quote online."
          />
        </div>
      </section>

      <AnimatedSection className="pb-16 md:pb-24">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <a
                href={siteConfig.contact.phoneHref}
                className="flex items-start gap-4 rounded-2xl border border-surface-border bg-surface p-6 transition-colors hover:border-accent/30"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-muted">
                  <Phone className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Phone</h2>
                  <p className="mt-1 text-lg text-accent">
                    {siteConfig.contact.phone}
                  </p>
                  <p className="mt-1 text-sm text-white/40">
                    Call us for immediate assistance
                  </p>
                </div>
              </a>

              <a
                href={siteConfig.contact.emailHref}
                className="flex items-start gap-4 rounded-2xl border border-surface-border bg-surface p-6 transition-colors hover:border-accent/30"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-muted">
                  <Mail className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Email</h2>
                  <p className="mt-1 text-lg text-accent">
                    {siteConfig.contact.email}
                  </p>
                  <p className="mt-1 text-sm text-white/40">
                    We respond within 2 business days
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4 rounded-2xl border border-surface-border bg-surface p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-muted">
                  <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Service Area</h2>
                  <p className="mt-1 text-white/60">
                    {siteConfig.location.serviceArea}
                  </p>
                  <p className="mt-1 text-sm text-white/40">
                    {siteConfig.location.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-surface-border bg-surface p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-muted">
                  <Clock className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Business Hours</h2>
                  <p className="mt-1 text-white/60">
                    {siteConfig.contact.hours}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-surface-border bg-surface p-8">
              <h2 className="text-2xl font-bold text-white">
                Prefer a Quote Online?
              </h2>
              <p className="mt-3 text-white/50">
                Fill out our detailed quote form with project photos and
                we&apos;ll provide an accurate estimate within 2 business days.
              </p>
              <ButtonLink href="/quote" size="lg" className="mt-6 w-full">
                Request a Free Quote
              </ButtonLink>
              <ButtonLink
                href={siteConfig.contact.phoneHref}
                variant="outline"
                size="lg"
                className="mt-4 w-full"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                Call {siteConfig.contact.phone}
              </ButtonLink>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
