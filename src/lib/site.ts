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
  factoryPhone: "+968 24449992",
  factoryPhoneHref: "tel:+96824449992",
  fax: "+968 24499935",

  email: "deltamuscat@omantel.net.om",
  emailHref: "mailto:deltamuscat@omantel.net.om",

  factoryAddress: "Road 11, Rusayl Industrial City, Muscat, Sultanate of Oman",
  mailingAddress:
    "P.O. Box 134, P.C. 134, Jawharat Al Shatti, Muscat, Sultanate of Oman",

  /** Absolute site URL used for canonical/OG tags. Override with NEXT_PUBLIC_SITE_URL. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://delta-muscat-factory.vercel.app",

  ogImage: "/images/og/og-default.jpg",
} as const;

export const solutionSlugs = [
  "pergolas",
  "parking-shades",
  "shade-structures",
  "metal-decoration",
] as const;

export type SolutionSlug = (typeof solutionSlugs)[number];
