import MediaCard from "@/components/MediaCard";
import PageHero from "@/components/PageHero";
import CtaBanner from "@/components/home/CtaBanner";
import Reveal from "@/components/Reveal";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { categories, t } from "@/lib/categories";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);
  return buildMetadata(locale as Locale, {
    title: `${dict.nav.products} — ${dict.meta.home.title.split("—")[0].trim()}`,
    description: dict.home.solutionsSection.lead,
    path: "/products",
  });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.products}
        title={dict.home.solutionsSection.title}
        lead={dict.home.solutionsSection.lead}
      />

      <section className="section-pad bg-paper">
        <div className="container-site grid gap-10 md:grid-cols-3">
          {categories.map((category, i) => (
            <Reveal key={category.id} delay={i * 100}>
              <MediaCard
                href={`/${locale}/${category.slug}`}
                image={category.image}
                imageAlt={t(category.name, locale)}
                index={`0${category.order}`}
                eyebrow={dict.nav.products}
                title={t(category.name, locale)}
                text={t(category.short, locale)}
                linkLabel={dict.common.learnMore}
                aspect="aspect-[4/3]"
                priority={i === 0}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBanner locale={locale} dict={dict} />
    </>
  );
}
