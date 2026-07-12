import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Logo } from "@/components/ui/Logo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/seo";
import { seoConfig } from "@/lib/seo-config";
import { siteConfig } from "@/lib/site-config";
import { Phone } from "lucide-react";

export const metadata = createMetadata({
  title: seoConfig.pages.quote.title,
  description: seoConfig.pages.quote.description,
  path: "/quote",
});

export default function QuotePage() {
  return (
    <>
      <section className="section-padding pt-32 md:pt-40">
        <div className="container-custom">
          <Breadcrumbs items={[{ name: "Free Quote", href: "/quote" }]} />
          <SectionHeading
            eyebrow="Free Quote"
            title="Request Your Free Quote"
            description="Tell us about your project and we'll provide a detailed, no-obligation estimate within 2 business days."
          />
        </div>
      </section>

      <AnimatedSection className="pb-16 md:pb-24">
        <div className="container-custom">
          <div className="grid items-start gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <QuoteForm />
            </div>
            <aside className="space-y-6 lg:col-span-2">
              <div className="flex justify-center rounded-2xl border border-surface-border bg-surface p-8">
                <Logo size="lg" />
              </div>
              <div className="rounded-2xl border border-surface-border bg-surface p-6">
                <h2 className="text-lg font-bold text-white">
                  What Happens Next?
                </h2>
                <ol className="mt-4 space-y-4">
                  {[
                    "Submit your project details and photos",
                    "We review and prepare your quote",
                    "Receive your detailed estimate within 2 business days",
                    "Book your project at a time that suits you",
                  ].map((step, i) => (
                    <li key={step} className="flex gap-3 text-sm text-white/60">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-accent/20 bg-accent-muted p-6">
                <h2 className="text-lg font-bold text-white">
                  Prefer to Talk?
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  Call us directly for immediate assistance with your project.
                </p>
                <a
                  href={siteConfig.contact.phoneHref}
                  className="mt-4 flex items-center gap-2 text-lg font-semibold text-accent hover:underline"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  {siteConfig.contact.phone}
                </a>
              </div>

              <div className="rounded-2xl border border-surface-border bg-surface p-6">
                <h2 className="text-lg font-bold text-white">
                  Why Choose Us?
                </h2>
                <ul className="mt-4 space-y-2">
                  {siteConfig.trustIndicators.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-white/60"
                    >
                      <span className="text-accent">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
