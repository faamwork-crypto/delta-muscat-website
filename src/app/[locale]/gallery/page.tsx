import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import GalleryGrid from "@/components/GalleryGrid";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { images } from "@/lib/images";

type Params = Promise<{ locale: string }>;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata(locale, dict.meta.gallery);
}

export default async function GalleryPage({ params }: { params: Params }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const g = dict.gallery;

  return (
    <>
      <PageHero
        eyebrow={g.eyebrow}
        title={g.title}
        lead={g.lead}
        image={images.galleryConcept2}
        imageAlt=""
      />

      <section className="section-pad bg-paper">
        <div className="container-site">
          <GalleryGrid
            items={g.items}
            filters={g.filters}
            conceptLabel={dict.common.conceptLabel}
            learnMore={dict.common.learnMore}
          />

          <Reveal delay={120}>
            <div className="mt-20 border border-line bg-paper-deep p-8 sm:p-10">
              <h2 className="display-3 text-ink">{g.disclaimerTitle}</h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
                {g.disclaimerText}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-graphite text-paper">
        <div className="container-site text-center">
          <Reveal>
            <h2 className="display-1 mx-auto max-w-2xl text-paper">{g.cta.title}</h2>
            <p className="lead mx-auto mt-5 max-w-xl text-steel-light">{g.cta.text}</p>
            <a
              href={`/${locale}/contact`}
              className="btn btn-primaryDark mt-9"
            >
              {g.cta.primary}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
