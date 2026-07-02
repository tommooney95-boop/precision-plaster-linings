import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CTABanner } from "@/components/ui/CTABanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";
import { createMetadata } from "@/lib/seo";
import { seoConfig } from "@/lib/seo-config";

export const metadata = createMetadata({
  title: seoConfig.pages.projects.title,
  description: seoConfig.pages.projects.description,
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <section className="section-padding pt-32 md:pt-40">
        <div className="container-custom">
          <Breadcrumbs items={[{ name: "Projects", href: "/projects" }]} />
          <SectionHeading
            eyebrow="Projects"
            title="Before & After Transformations"
            description={`See the quality of our work through real project case studies across ${seoConfig.regionName}.`}
          />
        </div>
      </section>

      <AnimatedSection className="pb-16 md:pb-24">
        <div className="container-custom space-y-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
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
