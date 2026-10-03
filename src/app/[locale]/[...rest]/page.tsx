import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";

/**
 * Unknown paths under a valid locale render the localized 404.
 * Static export requires full params enumeration; one dummy path per locale
 * is enough (the page only ever calls notFound()).
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale, rest: ["404"] }));
}

export default function CatchAllPage() {
  notFound();
}
