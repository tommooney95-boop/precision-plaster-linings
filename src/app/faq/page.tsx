import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CTABanner } from "@/components/ui/CTABanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQItem } from "@/components/faq/FAQItem";
import { faqs } from "@/data/faqs";
import { createMetadata, createSchemaGraph, createFAQSchema } from "@/lib/seo";
import { seoConfig } from "@/lib/seo-config";

export const metadata = createMetadata({
  title: seoConfig.pages.faq.title,
  description: seoConfig.pages.faq.description,
  path: "/faq",
});

export default function FAQPage() {
  const faqSchema = createSchemaGraph(createFAQSchema(faqs));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="section-padding pt-32 md:pt-40">
        <div className="container-custom">
          <Breadcrumbs items={[{ name: "FAQ", href: "/faq" }]} />
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="Got questions about plastering? We've answered the most common ones below. Can't find what you're looking for? Get in touch."
          />
        </div>
      </section>

      <AnimatedSection className="pb-16 md:pb-24">
        <div className="container-custom max-w-3xl">
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </AnimatedSection>

      <section className="section-padding bg-surface">
        <div className="container-custom">
          <CTABanner
            title="Still Have Questions?"
            description="Contact us directly or request a free quote — we're happy to help."
          />
        </div>
      </section>
    </>
  );
}
