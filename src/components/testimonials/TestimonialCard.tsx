import { Card } from "@/components/ui/Card";
import type { Testimonial } from "@/data/testimonials";
import { Quote, Star } from "lucide-react";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="relative flex h-full flex-col">
      <Quote
        className="absolute right-6 top-6 h-8 w-8 text-accent/20"
        aria-hidden="true"
      />
      <div className="mb-4 flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4 fill-accent text-accent"
            aria-hidden="true"
          />
        ))}
      </div>
      <blockquote className="flex-1 text-sm leading-relaxed text-white/70 md:text-base">
        &ldquo;{testimonial.text}&rdquo;
      </blockquote>
      <footer className="mt-6 border-t border-surface-border pt-4">
        <p className="font-semibold text-white">{testimonial.name}</p>
        <p className="text-sm text-white/40">
          {testimonial.role} &middot; {testimonial.location}
        </p>
        <p className="mt-1 text-xs font-medium text-accent">
          {testimonial.service}
        </p>
      </footer>
    </Card>
  );
}
