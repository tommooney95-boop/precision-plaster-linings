/**
 * Central business configuration — edit location, contact details,
 * and service area here without touching page components.
 */
export const siteConfig = {
  name: "Precision Plaster Linings",
  tagline: "Professional Plastering Done Right The First Time",
  description:
    "Premium residential and commercial plastering services across Albury–Wodonga and the surrounding NSW/Victoria border region. Gyprock, suspended ceilings, cornice installation, repairs, renovations and insurance work. Free quotes.",
  url: "https://www.precisionplasterlinings.com.au",

  // ── Brand assets (files in public/brand/) ───────────────────────
  brand: {
    logoWhite: "/brand/logo-reversed.png",
    logoWhiteMark: "/brand/ppl-logo-light-mark.png",
    logoJpg: "/brand/logo.jpg",
    logoReversedJpg: "/brand/logo-reversed.jpg",
    width: 2157,
    height: 1490,
    markWidth: 2157,
    markHeight: 596,
  },

  // ── Location (easily editable) ──────────────────────────────────
  location: {
    suburb: "Albury",
    state: "NSW",
    country: "Australia",
    regionName: "Albury–Wodonga",
    serviceArea: "Servicing Albury–Wodonga and surrounding regions across New South Wales and Victoria.",
    address: "Albury, NSW, Australia",
    postalCode: "2640",
    coordinates: {
      lat: -36.0737,
      lng: 146.9135,
    },
  },

  // ── Contact ───────────────────────────────────────────────────────
  contact: {
    phone: "0400 000 000",
    phoneHref: "tel:+61400000000",
    email: "info@precisionplasterlinings.com.au",
    emailHref: "mailto:info@precisionplasterlinings.com.au",
    hours: "Mon–Fri 7:00am – 5:00pm",
  },

  // ── Social ────────────────────────────────────────────────────────
  social: {
    facebook: "https://facebook.com/precisionplasterlinings",
    instagram: "https://instagram.com/precisionplasterlinings",
    linkedin: "https://linkedin.com/company/precisionplasterlinings",
  },

  // ── SEO Keywords ──────────────────────────────────────────────────
  keywords: [
    "Plasterer",
    "Plastering",
    "Gyprock",
    "Suspended Ceilings",
    "Cornice Installation",
    "Commercial Plastering",
    "Residential Plastering",
    "Patch Repairs",
    "Wall Repairs",
    "Ceiling Repairs",
    "Renovations",
    "Insurance Repairs",
    "Plasterer NSW",
    "Plasterer VIC",
    "Plastering Contractor",
    "Albury Plasterer",
    "Wodonga Plasterer",
  ],

  // ── Trust Indicators ──────────────────────────────────────────────
  trustIndicators: [
    "Fully Insured",
    "Free Quotes",
    "Quality Workmanship",
    "Reliable Service",
    "Experienced Team",
  ],

  // ── Navigation ────────────────────────────────────────────────────
  navLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
