import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { siteConfig } from "@/lib/site-config";

/** Pages indexed by Google — admin/dashboard excluded */
const INDEXED_PAGES: {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/quote", priority: 0.95, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.85, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.75, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.75, changeFrequency: "monthly" },
  { path: "/testimonials", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = INDEXED_PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency,
    priority,
  }));

  const serviceEntries = services.map((service) => ({
    url: `${siteConfig.url}/services/${service.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [...staticEntries, ...serviceEntries];
}
