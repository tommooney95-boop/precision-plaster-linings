/**

 * SEO configuration — Australian local search optimisation.

 * Edit location strings here to update titles, schema, and meta across the site.

 */

import { siteConfig } from "./site-config";



const { suburb, state, regionName } = siteConfig.location;

const locationLabel = `${suburb} ${state}`;



export const seoConfig = {

  /** Primary location keyword for titles — e.g. "Albury NSW" */

  locationLabel,



  /** Regional name for broader local SEO — e.g. "Albury–Wodonga" */

  regionName,



  /** Short location for descriptions */

  locationShort: siteConfig.location.serviceArea,



  /** Brand suffix for titles */

  brandSuffix: siteConfig.name,



  /** Default OG image path (dynamic OG also generated at /opengraph-image) */

  defaultOgImage: `${siteConfig.url}/opengraph-image`,



  /** Google Search Console verification — set in .env as GSC_VERIFICATION */

  gscVerification: process.env.GSC_VERIFICATION ?? "",



  /** Geo tags for Australian local SEO */

  geo: {

    region: "AU-NSW",

    placename: suburb,

    position: `${siteConfig.location.coordinates.lat};${siteConfig.location.coordinates.lng}`,

  },



  /** Service areas for schema markup */

  serviceAreas: [

    "Albury",

    "Wodonga",

    "Lavington",

    "Thurgoona",

    "North Albury",

    "East Albury",

    "Corowa",

    "Yarrawonga",

    "Holbrook",

    "Border Region",

  ],



  /** Title templates — keep under 60 characters where possible */

  pages: {

    home: {

      title: `${regionName} Plasterer – Residential & Commercial`,

      description: `Professional plasterer in ${locationLabel}. Gyprock, ceiling repairs, cornice, renovations & commercial fit-outs. Fully insured. Free quotes — call ${siteConfig.contact.phone}.`,

    },

    about: {

      title: `About Us – Trusted ${regionName} Plasterer`,

      description: `Meet ${siteConfig.name} — experienced plastering contractors serving ${regionName} and the surrounding border region. Quality workmanship, fully insured, free quotes on all projects.`,

    },

    services: {

      title: `Plastering Services ${locationLabel}`,

      description: `Complete plastering services in ${regionName} — residential, commercial, gyprock, suspended ceilings, cornice, repairs & insurance work. Get a free quote today.`,

    },

    gallery: {

      title: `Plastering Gallery – Our Work`,

      description: `View our plastering project gallery — residential homes, commercial fit-outs and renovation work across ${regionName}. Quality finishes you can see.`,

    },

    projects: {

      title: `Before & After Plastering Projects`,

      description: `Real before and after plastering projects in ${regionName} — ceiling repairs, renovations, commercial fit-outs and new home plastering by ${siteConfig.name}.`,

    },

    testimonials: {

      title: `Customer Reviews – ${regionName} Plasterer`,

      description: `Read reviews from homeowners, builders and property managers who trust ${siteConfig.name} for plastering in ${locationLabel}. 5-star quality workmanship.`,

    },

    faq: {

      title: `Plastering FAQ – Costs & Timelines`,

      description: `Answers to common plastering questions — costs, timelines, insurance work and free quotes. ${regionName} plasterer ${siteConfig.name} — call ${siteConfig.contact.phone}.`,

    },

    contact: {

      title: `Contact Us – ${regionName} Plasterer`,

      description: `Contact ${siteConfig.name} for plastering in ${locationLabel}. Call ${siteConfig.contact.phone} or request a free online quote. Mon–Fri service available.`,

    },

    quote: {

      title: `Free Plastering Quote – ${locationLabel}`,

      description: `Request a free, no-obligation plastering quote in ${regionName}. Upload photos, describe your project and receive a detailed estimate within 2 business days.`,

    },

    privacy: {

      title: `Privacy Policy`,

      description: `Privacy policy for ${siteConfig.name}. How we collect, use and protect your personal information when you request a plastering quote.`,

    },

    terms: {

      title: `Terms of Service`,

      description: `Terms of service for ${siteConfig.name} plastering services in ${locationLabel}. Quotes, payment terms, warranty and cancellation policy.`,

    },

  },

} as const;



/** Build a page title: "Primary Keyword | Brand" */

export function buildTitle(primary: string): string {

  return `${primary} | ${seoConfig.brandSuffix}`;

}



/** Build service page title */

export function buildServiceTitle(serviceName: string): string {

  return buildTitle(`${serviceName} ${seoConfig.locationLabel}`);

}



/** Truncate description to ~155 characters for SERP display */

export function truncateDescription(text: string, max = 155): string {

  if (text.length <= max) return text;

  return text.slice(0, max - 3).trimEnd() + "…";

}


