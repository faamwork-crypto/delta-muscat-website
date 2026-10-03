import type { Metadata } from "next";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/config";

type MetaInput = {
  title: string;
  description: string;
  /** Route path without locale prefix, e.g. "/solutions/pergolas" or "". */
  path?: string;
};

export function buildMetadata(locale: Locale, { title, description, path = "" }: MetaInput): Metadata {
  const url = `${site.url}/${locale}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${site.url}/en${path}`,
        ar: `${site.url}/ar${path}`,
        "x-default": `${site.url}/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      images: [{ url: `${site.url}${site.ogImage}`, width: 1200, height: 630, alt: site.name }],
      locale: locale === "ar" ? "ar_OM" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${site.url}${site.ogImage}`],
    },
  };
}
