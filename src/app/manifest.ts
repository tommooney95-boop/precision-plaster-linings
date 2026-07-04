import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Precision Plaster",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#111111",
    theme_color: "#111111",
    lang: "en-AU",
    orientation: "portrait-primary",
    categories: ["business", "construction"],
    icons: [
      {
        src: siteConfig.brand.logoReversed,
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
      {
        src: siteConfig.brand.logoReversed,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
