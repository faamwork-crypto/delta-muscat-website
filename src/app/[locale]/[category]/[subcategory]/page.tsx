import Breadcrumbs, { homeCrumb } from "@/components/Breadcrumbs";
import ButtonLink, { ArrowIcon } from "@/components/Button";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBanner from "@/components/home/CtaBanner";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { categories, getSubcategory, t } from "@/lib/categories";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; category: string; subcategory: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categories.flatMap((category) =>
      category.subcategories.map((sub) => ({
        locale,
        category: category.slug,
        subcategory: sub.slug,
      })),
    ),
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, category: categorySlug, subcategory: subSlug } = await params;
  if (!isLocale(locale)) return {};
  const found = getSubcategory(categorySlug, subSlug);
  if (!found) return {};
  return buildMetadata(locale as Locale, {
    title: `${t(found.subcategory.name, locale as Locale)} — Delta Muscat Steel & Aluminium`,
    description: t(found.subcategory.short, locale as Locale),
    path: `/${found.category.slug}/${found.subcategory.slug}`,
  });
}

export default async function SubcategoryPage({ params }: { params: Params }) {
  const { locale: raw, category: categorySlug, subcategory: subSlug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const found = getSubcategory(categorySlug, subSlug);
  if (!found) notFound();
  const { category, subcategory } = found;
  const dict = await getDictionary(locale);
  const categoryName = t(category.name, locale);
  const subName = t(subcategory.name, locale);

  // Related subcategories: siblings from the same parent, up to 6.
  const related = category.subcategories.filter((s) => s.id !== subcategory.id).slice(0, 6);

  return (
    <>
      <PageHero
        eyebrow={`${dict.nav.products} — ${categoryName}`}
        title={subName}
        lead={t(subcategory.short, locale)}
        image={subcategory.image ?? category.image}
        imageAlt=""
      />

      <Breadcrumbs
        ariaLabel={dict.categories.breadcrumbLabel}
        items={[
          homeCrumb(locale, dict.nav.home),
          { label: categoryName, href: `/${locale}/${category.slug}` },
          { label: subName },
        ]}
      />

      <section className="section-pad bg-paper">
        <div className="container-site grid gap-14 lg:grid-cols-[7fr_4fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow text-bronze-ink">{categoryName}</p>
              <p className="lead mt-6 text-ink-soft">{dict.categories.detailNote}</p>
              <ButtonLink href={`/${locale}/contact`} variant="primary" className="mt-8">
                {dict.common.requestConsultation}
              </ButtonLink>
            </Reveal>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <Reveal delay={100}>
              <div className="border border-line bg-paper-deep p-7">
                <h2 className="text-[11px] font-semibold tracking-[0.22em] text-bronze-ink uppercase">
                  {dict.categories.related}
                </h2>
                <ul className="mt-5 space-y-1">
                  {related.map((sib) => (
                    <li key={sib.id}>
                      <Link
                        href={`/${locale}/${category.slug}/${sib.slug}`}
                        className="group flex items-center justify-between gap-3 py-2.5 text-[14px] font-medium text-ink-soft transition-colors hover:text-bronze-ink"
                      >
                        {t(sib.name, locale)}
                        <ArrowIcon className="h-4 w-4 shrink-0 text-bronze transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* All subcategories in this category */}
      <section className="section-pad bg-paper-deep">
        <div className="container-site">
          <Reveal>
            <p className="eyebrow text-bronze-soft">{categoryName}</p>
            <h2 className="display-2 mt-4 text-ink">{dict.categories.subcategoriesLabel}</h2>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {category.subcategories.map((sib) => (
              <Link
                key={sib.id}
                href={`/${locale}/${category.slug}/${sib.slug}`}
                className={`chip transition-colors ${
                  sib.id === subcategory.id
                    ? "border-bronze bg-bronze text-paper"
                    : "hover:border-bronze hover:text-bronze-ink"
                }`}
                aria-current={sib.id === subcategory.id ? "page" : undefined}
              >
                {t(sib.name, locale)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner locale={locale} dict={dict} />
    </>
  );
}
