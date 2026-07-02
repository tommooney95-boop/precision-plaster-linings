import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CTABanner } from "@/components/ui/CTABanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/services/ServiceCard";
import { createMetadata } from "@/lib/seo";
import { seoConfig } from "@/lib/seo-config";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/data/services";

export const metadata = createMetadata({
  title: seoConfig.pages.services.title,
  description: seoConfig.pages.services.description,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <section className="section-padding pt-32 md:pt-40">
        <div className="container-custom">
          <Breadcrumbs items={[{ name: "Services", href: "/services" }]} />
          <SectionHeading
            eyebrow="Services"
            title="Complete Plastering Solutions"
            description={`${siteConfig.name} provides a full range of plastering services for residential and commercial clients across ${siteConfig.location.serviceArea}.`}
            align="left"
          />
        </div>
      </section>

      <AnimatedSection className="pb-16 md:pb-24">
        <div className="container-custom">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <section className="section-padding bg-surface">
        <div className="container-custom">
          <CTABanner />
        </div>
      </section>
    </>
  );
}
