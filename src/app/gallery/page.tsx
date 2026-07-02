import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CTABanner } from "@/components/ui/CTABanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { galleryImages } from "@/data/gallery";
import { createMetadata } from "@/lib/seo";
import { seoConfig } from "@/lib/seo-config";

export const metadata = createMetadata({
  title: seoConfig.pages.gallery.title,
  description: seoConfig.pages.gallery.description,
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <section className="section-padding pt-32 md:pt-40">
        <div className="container-custom">
          <Breadcrumbs items={[{ name: "Gallery", href: "/gallery" }]} />
          <SectionHeading
            eyebrow="Gallery"
            title="Our Work Speaks for Itself"
            description="Explore our portfolio of completed plastering projects. Filter by category to find work similar to your project."
          />
        </div>
      </section>

      <AnimatedSection className="pb-16 md:pb-24">
        <div className="container-custom">
          <GalleryGrid images={galleryImages} />
        </div>
      </AnimatedSection>

      <section className="section-padding bg-surface">
        <div className="container-custom">
          <CTABanner
            title="Want Results Like These?"
            description="Get a free quote for your plastering project today."
          />
        </div>
      </section>
    </>
  );
}
