import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { site, solutionSlugs } from "@/lib/site";
import { categories } from "@/lib/categories";

// Required for `output: export` (GitHub Pages build).
export const dynamic = "force-static";

const baseRoutes = [
  "",
  "/about",
  "/solutions",
  ...solutionSlugs.map((slug) => `/solutions/${slug}`),
  "/products",
  ...categories.flatMap((category) => [
    `/${category.slug}`,
    ...category.subcategories.map((sub) => `/${category.slug}/${sub.slug}`),
  ]),
  "/sectors",
  "/process",
  "/materials",
  "/gallery",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return locales.flatMap((locale) =>
    baseRoutes.map((route) => ({
      url: `${site.url}/${locale}${route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : route.startsWith("/solutions/") ? 0.9 : 0.7,
    }))
  );
}
