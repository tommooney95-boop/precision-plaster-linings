import type { Metadata } from "next";
import { services } from "@/data/services";
import { siteConfig } from "./site-config";
import { buildTitle, seoConfig, truncateDescription } from "./seo-config";

interface PageSEO {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  /** Override the full title instead of using buildTitle() */
  rawTitle?: string;
}

export function createMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
  rawTitle,
}: PageSEO): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? seoConfig.defaultOgImage;
  const fullTitle = rawTitle ?? buildTitle(title);
  const metaDescription = truncateDescription(description);

  const metadata: Metadata = {
    title: fullTitle,
    description: metaDescription,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: {
        "en-AU": url,
      },
    },
    category: "Construction",
    openGraph: {
      type: "website",
      locale: "en_AU",
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description: metaDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — Professional Plastering Services in ${siteConfig.location.regionName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    other: {
      "geo.region": seoConfig.geo.region,
      "geo.placename": seoConfig.geo.placename,
      "geo.position": seoConfig.geo.position,
      ICBM: seoConfig.geo.position.replace(";", ", "),
      "content-language": "en-AU",
    },
  };

  if (seoConfig.gscVerification) {
    metadata.verification = {
      google: seoConfig.gscVerification,
    };
  }

  return metadata;
}

/* ── Schema.org helpers ─────────────────────────────────────────── */

function areaServedSchema() {
  return seoConfig.serviceAreas.map((area) => ({
    "@type": "City" as const,
    name: area,
    containedInPlace: {
      "@type": "State",
      name: "New South Wales",
      containedInPlace: {
        "@type": "Country",
        name: "Australia",
      },
    },
  }));
}

export function createOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
      areaServed: "AU",
      availableLanguage: "English",
    },
    sameAs: Object.values(siteConfig.social),
  };
}

export function createWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en-AU",
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function createLocalBusinessSchema() {
  return {
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    image: `${siteConfig.url}/opengraph-image`,
    priceRange: "$$",
    currenciesAccepted: "AUD",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.location.address,
      addressLocality: siteConfig.location.suburb,
      addressRegion: siteConfig.location.state,
      postalCode: siteConfig.location.postalCode,
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.location.coordinates.lat,
      longitude: siteConfig.location.coordinates.lng,
    },
    areaServed: areaServedSchema(),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "12:00",
      },
    ],
    sameAs: Object.values(siteConfig.social),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Plastering Services ${siteConfig.location.regionName}`,
      itemListElement: services.map((service, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.shortDescription,
          url: `${siteConfig.url}/services/${service.slug}`,
          provider: { "@id": `${siteConfig.url}/#localbusiness` },
          areaServed: {
            "@type": "State",
            name: "New South Wales",
          },
        },
      })),
    },
  };
}

export function createServiceSchema(service: {
  title: string;
  shortDescription: string;
  slug: string;
  fullDescription: string;
}) {
  return {
    "@type": "Service",
    "@id": `${siteConfig.url}/services/${service.slug}/#service`,
    name: `${service.title} ${siteConfig.location.suburb}`,
    description: service.fullDescription,
    url: `${siteConfig.url}/services/${service.slug}`,
    provider: { "@id": `${siteConfig.url}/#localbusiness` },
    areaServed: areaServedSchema(),
    serviceType: service.title,
  };
}

export function createFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function createBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

export function createReviewSchema(
  reviews: {
    name: string;
    text: string;
    rating: number;
    date?: string;
  }[]
) {
  const ratings = reviews.map((r) => r.rating);
  const avg =
    ratings.reduce((a, b) => a + b, 0) / ratings.length;

  return {
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#reviews`,
    name: siteConfig.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avg.toFixed(1),
      reviewCount: reviews.length,
      bestRating: "5",
      worstRating: "1",
    },
    review: reviews.map((r) => {
      const review: Record<string, unknown> = {
        "@type": "Review",
        author: { "@type": "Person", name: r.name },
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: "5",
        },
        reviewBody: r.text,
      };
      if (r.date) {
        review.datePublished = r.date;
      }
      return review;
    }),
  };
}

/** Combine multiple schemas into a single @graph for cleaner markup */
export function createSchemaGraph(
  ...nodes: Record<string, unknown>[]
) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

/** Root layout schema — Organization + WebSite + LocalBusiness */
export function createRootSchemaGraph() {
  return createSchemaGraph(
    createOrganizationSchema(),
    createWebSiteSchema(),
    createLocalBusinessSchema()
  );
}
