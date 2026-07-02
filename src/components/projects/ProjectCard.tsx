import { Card } from "@/components/ui/Card";
import type { Project } from "@/data/projects";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card hover={false} className="overflow-hidden p-0">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto">
          <div className="grid h-full grid-cols-2">
            <div className="relative">
              <Image
                src={project.beforeImage}
                alt={`Before: ${project.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
              />
              <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                Before
              </span>
            </div>
            <div className="relative">
              <Image
                src={project.afterImage}
                alt={`After: ${project.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
              />
              <span className="absolute left-3 top-3 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-white">
                After
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center p-6 md:p-8">
          <h3 className="text-xl font-bold text-white md:text-2xl">
            {project.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/50">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/40">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
              {project.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-accent" aria-hidden="true" />
              {project.duration}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.services.map((service) => (
              <span
                key={service}
                className="rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
