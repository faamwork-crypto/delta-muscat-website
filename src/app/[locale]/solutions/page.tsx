import MediaCard from "@/components/MediaCard";
import PageHero from "@/components/PageHero";
import CtaBanner from "@/components/home/CtaBanner";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { solutionImages } from "@/lib/images";
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
  const dict = await getDictionary(locale);
  return buildMetadata(locale, dict.meta.solutions);
}

export default async function SolutionsPage({
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
        eyebrow={dict.nav.solutions}
        title={dict.home.solutionsSection.title}
        lead={dict.home.solutionsSection.lead}
        image="/images/solutions/pergolas.svg"
        imageAlt=""
      />

      <section className="section-pad bg-paper">
        <div className="container-site grid gap-10 md:grid-cols-2">
          {dict.solutions.slugList.map((slug, i) => {
            const item = dict.solutions[slug as "pergolas"];
            return (
              <Reveal key={slug} delay={(i % 2) * 100}>
                <MediaCard
                  href={`/${locale}/solutions/${slug}`}
                  image={solutionImages[slug]}
                  imageAlt={item.name}
                  index={item.index}
                  title={item.name}
                  text={item.short}
                  linkLabel={dict.common.learnMore}
                  aspect="aspect-[16/11]"
                  priority={i < 2}
                />
              </Reveal>
            );
          })}
        </div>

        <div className="mt-16">
          <SectionHeading
            eyebrow={dict.common.conceptLabel}
            title={dict.home.featured.title}
            lead={dict.home.featured.lead}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dict.gallery.items.slice(0, 4).map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <a href={`/${locale}/gallery`} className="group block">
                  <figure className="media-card-img relative aspect-[4/3] bg-sand">
                    <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                    <span className="chip chip-concept absolute end-3 top-3">{item.concept}</span>
                  </figure>
                  <p className="mt-3 text-[11px] font-semibold tracking-[0.2em] text-bronze-ink uppercase">
                    {item.concept}
                  </p>
                  <h3 className="mt-1 text-[15px] font-semibold text-ink">{item.title}</h3>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner locale={locale} dict={dict} />
    </>
  );
}
