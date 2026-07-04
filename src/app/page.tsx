import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceCard } from "@/components/services/ServiceCard";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { FAQItem } from "@/components/faq/FAQItem";
import { CTABanner } from "@/components/ui/CTABanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { faqs } from "@/data/faqs";
import { siteConfig } from "@/lib/site-config";
import { seoConfig } from "@/lib/seo-config";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Services */}
      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Our Services"
            title="Expert Plastering for Every Project"
            description={`From small patch repairs to full commercial fit-outs, ${siteConfig.name} delivers premium results across ${siteConfig.location.serviceArea}.`}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/services" variant="outline">
              View All Services
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </AnimatedSection>

      {/* Quote Form — Highest Priority */}
      <AnimatedSection
        id="quote"
        className="section-padding bg-surface"
        delay={0.1}
      >
        <div className="container-custom">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Free Quote"
                title="Get Your Project Started Today"
                description="Tell us about your project and receive a detailed, no-obligation quote within 24 hours. Upload photos to help us provide the most accurate estimate."
                align="left"
              />
              <div className="mt-8 space-y-4">
                {siteConfig.trustIndicators.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-white/60"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-muted text-sm font-bold text-accent">
                      ✓
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <QuoteForm />
          </div>
        </div>
      </AnimatedSection>

      {/* Gallery Preview */}
      <AnimatedSection className="section-padding" delay={0.1}>
        <div className="container-custom">
          <SectionHeading
            eyebrow="Our Work"
            title="Quality You Can See"
            description={`Browse our portfolio of completed plastering projects across ${seoConfig.regionName}.`}
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
                alt: `Smooth residential plaster finish on living room walls — ${seoConfig.regionName}`,
              },
              {
                src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
                alt: `New home interior plastering with clean white walls — ${siteConfig.location.suburb} NSW`,
              },
              {
                src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
                alt: `Commercial office plastering and fit-out — ${seoConfig.regionName} commercial plasterer`,
              },
              {
                src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
                alt: `Renovation plastering with flawless ceiling and wall finish — ${siteConfig.location.suburb}`,
              },
            ].map((item) => (
              <div
                key={item.src}
                className="relative aspect-square overflow-hidden rounded-2xl"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/gallery" variant="outline">
              View Full Gallery
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Preview */}
      <AnimatedSection className="section-padding bg-surface" delay={0.1}>
        <div className="container-custom">
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by Homeowners & Builders"
            description="Don't just take our word for it — hear from our satisfied clients."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/testimonials" variant="outline">
              Read All Reviews
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Preview */}
      <AnimatedSection className="section-padding" delay={0.1}>
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow="FAQ"
              title="Common Questions"
              description="Everything you need to know about our plastering services."
              align="left"
            />
            <div>
              {faqs.slice(0, 4).map((faq, i) => (
                <FAQItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  defaultOpen={i === 0}
                />
              ))}
              <Link
                href="/faq"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
              >
                View all FAQs
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <CTABanner />
        </div>
      </section>
    </>
  );
}
