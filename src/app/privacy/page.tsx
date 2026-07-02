import { ButtonLink } from "@/components/ui/ButtonLink";
import { createMetadata } from "@/lib/seo";
import { seoConfig } from "@/lib/seo-config";
import { siteConfig } from "@/lib/site-config";

export const metadata = createMetadata({
  title: seoConfig.pages.privacy.title,
  description: seoConfig.pages.privacy.description,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="section-padding pt-32 md:pt-40">
      <div className="container-custom max-w-3xl">
        <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-4 text-white/50">Last updated: June 2026</p>

        <div className="prose-invert mt-10 space-y-6 text-white/60">
          <section>
            <h2 className="text-xl font-semibold text-white">
              Information We Collect
            </h2>
            <p className="mt-3 leading-relaxed">
              When you request a quote or contact us, we may collect personal
              information including your name, phone number, email address,
              property address and project details. We may also collect photos
              you upload related to your project.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              How We Use Your Information
            </h2>
            <p className="mt-3 leading-relaxed">
              We use your information solely to respond to your enquiry,
              provide quotes, schedule work and communicate about your project.
              We do not sell or share your personal information with third
              parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              Data Security
            </h2>
            <p className="mt-3 leading-relaxed">
              We take reasonable steps to protect your personal information
              from unauthorised access, modification or disclosure. Information
              is stored securely and accessed only by authorised personnel.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Contact Us</h2>
            <p className="mt-3 leading-relaxed">
              If you have questions about this privacy policy or wish to access
              or correct your personal information, please contact us at{" "}
              <a
                href={siteConfig.contact.emailHref}
                className="text-accent hover:underline"
              >
                {siteConfig.contact.email}
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
