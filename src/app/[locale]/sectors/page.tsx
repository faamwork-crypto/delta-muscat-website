import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBanner from "@/components/home/CtaBanner";
import { sectorImages } from "@/lib/images";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string }>;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata(locale, dict.meta.sectors);
}

export default async function SectorsPage({ params }: { params: Params }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.sectors.eyebrow}
        title={dict.sectors.title}
        lead={dict.sectors.lead}
        image="/images/sectors/commercial.svg"
        imageAlt=""
      />

      <section className="section-pad bg-paper">
        <div className="container-site space-y-24 sm:space-y-28">
          {dict.sectors.items.map((sector, i) => {
            const reversed = i % 2 === 1;
            return (
              <article
                key={sector.id}
                id={sector.id}
                className="grid scroll-mt-28 items-center gap-12 lg:grid-cols-2 lg:gap-16"
              >
                <Reveal className={reversed ? "lg:order-2" : ""}>
                  <div className="media-card-img relative aspect-[4/3] bg-sand">
                    <img
                      src={sectorImages[sector.id]}
                      alt={sector.title}
                      loading={i < 2 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <span className="absolute bottom-0 start-0 bg-graphite-deep px-5 py-2.5 font-display text-[15px] text-bronze-soft">
                      0{i + 1}
                    </span>
                  </div>
                </Reveal>

                <Reveal delay={120} className={reversed ? "lg:order-1" : ""}>
                  <p className="eyebrow text-bronze-ink">{sector.name}</p>
                  <h2 className="display-2 mt-4 text-ink">{sector.title}</h2>
                  <div className="mt-5 space-y-4">
                    {sector.paragraphs.map((p) => (
                      <p key={p.slice(0, 24)} className="text-[15px] leading-relaxed text-ink-soft">
                        {p}
                      </p>
                    ))}
                  </div>
                  <h3 className="mt-8 text-[11px] font-semibold tracking-[0.22em] text-bronze-ink uppercase">
                    {locale === "ar" ? "ما نقدمه لهذا القطاع" : "What we deliver in this sector"}
                  </h3>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {sector.delivers.map((d) => (
                      <li key={d} className="flex items-center gap-3 text-[14px] text-ink">
                        <span className="h-1.5 w-1.5 shrink-0 bg-bronze" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </article>
            );
          })}
        </div>
      </section>

      <CtaBanner locale={locale} dict={dict} />
    </>
  );
}
