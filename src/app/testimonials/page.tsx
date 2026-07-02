import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CTABanner } from "@/components/ui/CTABanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { testimonials } from "@/data/testimonials";
import {
  createMetadata,
  createReviewSchema,
  createSchemaGraph,
} from "@/lib/seo";
import { seoConfig } from "@/lib/seo-config";

export const metadata = createMetadata({
  title: seoConfig.pages.testimonials.title,
  description: seoConfig.pages.testimonials.description,
  path: "/testimonials",
});

export default function TestimonialsPage() {
  const reviewSchema = createSchemaGraph(
    createReviewSchema(
      testimonials.map((t) => ({
        name: t.name,
        text: t.text,
        rating: t.rating,
      }))
    )
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />

      <section className="section-padding pt-32 md:pt-40">
        <div className="container-custom">
          <Breadcrumbs items={[{ name: "Testimonials", href: "/testimonials" }]} />
          <SectionHeading
            eyebrow="Testimonials"
            title="What Our Clients Say"
            description="Real reviews from homeowners, builders, property managers and renovators who trust Precision Plaster Linings."
          />
        </div>
      </section>

      <AnimatedSection className="pb-16 md:pb-24">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <section className="section-padding bg-surface">
        <div className="container-custom">
          <CTABanner
            title="Join Our Happy Clients"
            description="Experience the quality and service that earns us 5-star reviews."
          />
        </div>
      </section>
    </>
  );
}
