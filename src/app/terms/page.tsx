import { ButtonLink } from "@/components/ui/ButtonLink";
import { createMetadata } from "@/lib/seo";
import { seoConfig } from "@/lib/seo-config";
import { siteConfig } from "@/lib/site-config";

export const metadata = createMetadata({
  title: seoConfig.pages.terms.title,
  description: seoConfig.pages.terms.description,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="section-padding pt-32 md:pt-40">
      <div className="container-custom max-w-3xl">
        <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
        <p className="mt-4 text-white/50">Last updated: June 2026</p>

        <div className="prose-invert mt-10 space-y-6 text-white/60">
          <section>
            <h2 className="text-xl font-semibold text-white">
              Quotes & Estimates
            </h2>
            <p className="mt-3 leading-relaxed">
              All quotes provided by {siteConfig.name} are free and
              no-obligation. Quotes are valid for 30 days unless otherwise
              stated. Final pricing may vary if project scope changes after
              on-site inspection.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              Payment Terms
            </h2>
            <p className="mt-3 leading-relaxed">
              Payment terms will be outlined in your project quote. For larger
              projects, a deposit may be required before work commences. Final
              payment is due upon completion and your satisfaction with the work.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Warranty</h2>
            <p className="mt-3 leading-relaxed">
              We stand behind our workmanship. If you experience any issues with
              our plastering work within the warranty period, contact us and we
              will rectify the issue at no additional cost.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              Cancellation Policy
            </h2>
            <p className="mt-3 leading-relaxed">
              We understand plans change. Please provide at least 48 hours notice
              if you need to cancel or reschedule. Deposits may be forfeited for
              cancellations with less than 48 hours notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p className="mt-3 leading-relaxed">
              For questions about these terms, contact us at{" "}
              <a
                href={siteConfig.contact.emailHref}
                className="text-accent hover:underline"
              >
                {siteConfig.contact.email}
              </a>{" "}
              or call{" "}
              <a
                href={siteConfig.contact.phoneHref}
                className="text-accent hover:underline"
              >
                {siteConfig.contact.phone}
              </a>
              .
            </p>
          </section>
        </div>

        <ButtonLink href="/contact" variant="outline" className="mt-10">
          Contact Us
        </ButtonLink>
      </div>
    </article>
  );
}
