import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Hammer,
  Home,
  Layers,
  Paintbrush,
  Shield,
  Sparkles,
  Wrench,
} from "lucide-react";

export interface Service {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: LucideIcon;
  features: string[];
  image: string;
}

export const services: Service[] = [
  {
    slug: "residential-plastering",
    title: "Residential Plastering",
    shortDescription:
      "Flawless gyprock and plaster finishes for homes, apartments and townhouses across the Albury–Wodonga region.",
    fullDescription:
      "Transform your home with expert residential plastering. From new builds to extensions, we deliver smooth, durable finishes that stand the test of time. Our team handles everything from board installation to final sanding and preparation for painting.",
    icon: Home,
    features: [
      "New home plastering",
      "Gyprock installation",
      "Wall and ceiling lining",
      "Smooth finish guarantee",
    ],
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  },
  {
    slug: "commercial-plastering",
    title: "Commercial Plastering",
    shortDescription:
      "Large-scale plastering for offices, retail spaces, warehouses and commercial fit-outs.",
    fullDescription:
      "We partner with builders and developers on commercial projects of all sizes. Our experienced crews work to tight deadlines without compromising quality, delivering professional finishes for offices, retail spaces, warehouses and more.",
    icon: Building2,
    features: [
      "Office fit-outs",
      "Retail spaces",
      "Warehouse lining",
      "Project management",
    ],
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
  },
  {
    slug: "renovations",
    title: "Renovations",
    shortDescription:
      "Complete plastering solutions for kitchen, bathroom and whole-home renovation projects.",
    fullDescription:
      "Renovating your property? We provide comprehensive plastering services for renovation projects, including demolition of old plaster, new board installation, patching and finishing. We work seamlessly with your other trades to keep your project on schedule.",
    icon: Sparkles,
    features: [
      "Kitchen renovations",
      "Bathroom updates",
      "Whole-home makeovers",
      "Heritage restorations",
    ],
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
  },
  {
    slug: "new-homes",
    title: "New Homes",
    shortDescription:
      "Full plastering packages for new home builds, working alongside builders and developers.",
    fullDescription:
      "Building a new home? We provide complete plastering packages for residential new builds. Working closely with builders and developers, we ensure every wall and ceiling is finished to the highest standard before handover.",
    icon: Layers,
    features: [
      "Full home packages",
      "Builder partnerships",
      "Multi-dwelling projects",
      "Quality inspections",
    ],
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  },
  {
    slug: "ceiling-repairs",
    title: "Ceiling Repairs",
    shortDescription:
      "Expert repair of cracked, sagging and water-damaged ceilings with seamless finishes.",
    fullDescription:
      "Ceiling damage can be unsightly and dangerous. We repair cracked, sagging and water-damaged ceilings with precision, matching existing textures and finishes so repairs are virtually invisible.",
    icon: Hammer,
    features: [
      "Crack repairs",
      "Sagging ceiling fixes",
      "Water damage repair",
      "Texture matching",
    ],
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
  },
  {
    slug: "wall-repairs",
    title: "Wall Repairs",
    shortDescription:
      "Professional wall repair for holes, cracks, dents and general wear and tear.",
    fullDescription:
      "From small dents to large holes, we restore your walls to pristine condition. Our repair techniques ensure a seamless finish that blends perfectly with surrounding surfaces, ready for painting.",
    icon: Wrench,
    features: [
      "Hole patching",
      "Crack repairs",
      "Impact damage",
      "Surface preparation",
    ],
    image:
      "https://images.unsplash.com/photo-1581094793769-4107200a6143?w=800&q=80",
  },
  {
    slug: "cornice-installation",
    title: "Cornice Installation",
    shortDescription:
      "Decorative cornice and moulding installation to add elegance to any room.",
    fullDescription:
      "Add character and elegance to your spaces with professional cornice installation. We supply and install a wide range of cornice profiles, from classic designs to modern minimalist styles.",
    icon: Paintbrush,
    features: [
      "Standard cornice",
      "Decorative mouldings",
      "Custom profiles",
      "Repair and replacement",
    ],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    slug: "small-patch-repairs",
    title: "Small Patch Repairs",
    shortDescription:
      "Quick, affordable patch repairs for minor plaster damage — same-week service available.",
    fullDescription:
      "Don't let small plaster damage become a big problem. Our patch repair service is fast, affordable and delivers invisible results. Perfect for rental properties, pre-sale touch-ups and minor damage.",
    icon: Wrench,
    features: [
      "Same-week service",
      "Affordable pricing",
      "Invisible repairs",
      "Rental property work",
    ],
    image:
      "https://images.unsplash.com/photo-1504149927708-0d9f0e0b0a0a?w=800&q=80",
  },
  {
    slug: "insurance-repairs",
    title: "Insurance Repairs",
    shortDescription:
      "Streamlined insurance claim plastering repairs with documentation and fast turnaround.",
    fullDescription:
      "We work directly with homeowners, property managers and insurance companies to deliver fast, professional repair work. We provide detailed quotes and documentation to support your insurance claim.",
    icon: Shield,
    features: [
      "Insurance documentation",
      "Fast turnaround",
      "Water & fire damage",
      "Property manager friendly",
    ],
    image:
      "https://images.unsplash.com/photo-1454165804603-c5d57bc86b40?w=800&q=80",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
