/**
 * Verified company information for Delta Muscat Steel & Aluminium.
 * Source: the company's own published content (reference site, Oct 2026).
 * Do not add claims, certifications or statistics that are not verified here.
 */

export const site = {
  name: "Delta Muscat Steel & Aluminium",
  shortName: "Delta Muscat",
  legalSuffix: "LLC",

  /** Commercial registration number (published by the company). */
  crNumber: "1613650",

  headOfficePhone: "+968 24499947",
  headOfficePhoneHref: "tel:+96824499947",
  headOfficePhone2: "+968 24499935",
  headOfficePhone2Href: "tel:+96824499935",
  factoryPhone: "+968 24449992",
  factoryPhoneHref: "tel:+96824449992",

  email: "info@deltamuscat.com",
  emailHref: "mailto:info@deltamuscat.com",

  factoryAddress: "Road 11, Rusayl Industries, Sultanate of Oman",
  mailingAddress:
    "P.O. Box 134, P.C. 134, Jawharat Al Shatti, Muscat, Sultanate of Oman",

  /** Absolute site URL used for canonical/OG tags. Override with NEXT_PUBLIC_SITE_URL. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://delta-muscat-factory.vercel.app",

  ogImage: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/og/og-default.jpg`,
} as const;

/**
 * Base path prefix for raw <a>/<img> targets (not needed for next/link, which
 * applies basePath automatically). Empty in normal builds; set to
 * "/delta-muscat-website" for GitHub Pages builds (scripts/build-ghpages.mjs).
 */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const solutionSlugs = [
  "pergolas",
  "parking-shades",
  "shade-structures",
  "metal-decoration",
] as const;

export type SolutionSlug = (typeof solutionSlugs)[number];
