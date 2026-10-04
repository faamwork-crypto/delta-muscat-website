import Breadcrumbs, { homeCrumb } from "@/components/Breadcrumbs";
import MediaCard from "@/components/MediaCard";
import PageHero from "@/components/PageHero";
import CtaBanner from "@/components/home/CtaBanner";
import Reveal from "@/components/Reveal";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { categories, getCategory, t } from "@/lib/categories";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; category: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categories.map((category) => ({ locale, category: category.slug })),
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;
  if (!isLocale(locale)) return {};
  const category = getCategory(categorySlug);
  if (!category) return {};
  return buildMetadata(locale as Locale, {
    title: `${t(category.name, locale as Locale)} — Delta Muscat Steel & Aluminium`,
    description: t(category.short, locale as Locale),
    path: `/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { locale: raw, category: categorySlug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const category = getCategory(categorySlug);
  // dynamicParams = false already 404s unknown categories; guard for safety.
  if (!category) notFound();
  const dict = await getDictionary(locale);
  const categoryName = t(category.name, locale);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.products}
        title={categoryName}
        lead={t(category.short, locale)}
        image={category.image}
        imageAlt=""
      />

      <Breadcrumbs
        ariaLabel={dict.categories.breadcrumbLabel}
        items={[homeCrumb(locale, dict.nav.home), { label: categoryName }]}
      />

      <section className="section-pad bg-paper">
        <div className="container-site">
          <Reveal>
            <p className="eyebrow text-bronze-ink">{dict.categories.subcategoriesLabel}</p>
          </Reveal>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {category.subcategories.map((sub, i) => (
              <Reveal key={sub.id} delay={(i % 4) * 80}>
                <MediaCard
                  href={`/${locale}/${category.slug}/${sub.slug}`}
                  image={sub.image}
                  imageAlt={t(sub.name, locale)}
                  index={`${sub.order}`.padStart(2, "0")}
                  title={t(sub.name, locale)}
                  text={t(sub.short, locale)}
                  linkLabel={dict.common.learnMore}
                  aspect="aspect-[4/3]"
                  priority={i < 4}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner locale={locale} dict={dict} />
    </>
  );
}
