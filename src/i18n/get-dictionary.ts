import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/i18n/dictionaries/en").then((m) => m.default),
  ar: () => import("@/i18n/dictionaries/ar").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
