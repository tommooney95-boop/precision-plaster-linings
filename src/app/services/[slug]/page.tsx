import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CTABanner } from "@/components/ui/CTABanner";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedServices } from "@/components/seo/RelatedServices";
import { services, getServiceBySlug } from "@/data/services";
import {
  createMetadata,
  createSchemaGraph,
  createServiceSchema,
  createBreadcrumbSchema,
} from "@/lib/seo";
import { buildServiceTitle, seoConfig } from "@/lib/seo-config";
import { siteConfig } from "@/lib/site-config";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return createMetadata({
    title: service.title,
    rawTitle: buildServiceTitle(service.title),
    description: `${service.shortDescription} ${seoConfig.regionName} plasterer — free quotes across ${siteConfig.location.serviceArea}. Call ${siteConfig.contact.phone}.`,
    path: `/services/${slug}`,
    image: service.image,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = service.icon;

  const schema = createSchemaGraph(
    createServiceSchema(service),
    createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
      { name: service.title, url: `/services/${slug}` },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="section-padding pt-32 md:pt-40">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { name: "Services", href: "/services" },
              { name: service.title, href: `/services/${slug}` },
            ]}
          />

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-muted">
                <Icon className="h-7 w-7 text-accent" aria-hidden="true" />
              </div>
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                {service.title} in {siteConfig.location.regionName}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/60">
                {service.fullDescription}
              </p>
              <ul className="mt-8 space-y-3" aria-label={`${service.title} features`}>
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-white/70"
                  >
                    <Check
                      className="h-5 w-5 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <ButtonLink href="/quote" size="lg">
                  Request a Free Quote
                </ButtonLink>
                <ButtonLink
                  href={siteConfig.contact.phoneHref}
                  variant="outline"
                  size="lg"
                >
                  Call {siteConfig.contact.phone}
                </ButtonLink>
              </div>
              <p className="mt-6 text-sm text-white/40">
                Also see our{" "}
                <Link href="/gallery" className="text-accent hover:underline">
                  project gallery
                </Link>
                ,{" "}
                <Link href="/faq" className="text-accent hover:underline">
                  plastering FAQ
                </Link>
                , and{" "}
                <Link href="/testimonials" className="text-accent hover:underline">
                  customer reviews
                </Link>
                .
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={service.image}
                alt={`${service.title} service in ${seoConfig.locationLabel} — ${siteConfig.name} professional plastering`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          <RelatedServices currentSlug={slug} />
        </div>
      </section>

      <AnimatedSection className="section-padding bg-surface" delay={0.1}>
        <div className="container-custom">
          <CTABanner
            title={`Need ${service.title} in ${siteConfig.location.regionName}?`}
            description="Get a free, no-obligation quote. We respond within 24 hours."
          />
        </div>
      </AnimatedSection>
    </>
  );
}
