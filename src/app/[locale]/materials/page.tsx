import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CtaBanner from "@/components/home/CtaBanner";
import { images, materialImages } from "@/lib/images";
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
  return buildMetadata(locale, dict.meta.materials);
}

export default async function MaterialsPage({ params }: { params: Params }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const m = dict.materials;

  return (
    <>
      <PageHero
        eyebrow={m.eyebrow}
        title={m.title}
        lead={m.lead}
        image="/images/materials/finishes.svg"
        imageAlt=""
      />

      {/* Material categories */}
      <section className="section-pad bg-paper">
        <div className="container-site grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {m.categories.map((category, i) => (
            <Reveal key={category.name} delay={(i % 3) * 90}>
              <article className="group flex h-full flex-col border border-line bg-paper transition-colors hover:border-bronze/50">
                <div className="media-card-img aspect-[4/3] bg-sand">
                  <img
                    src={materialImages[i]}
                    alt={category.name}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="font-display text-[14px] text-bronze">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="display-3 mt-2 text-ink">{category.name}</h2>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{category.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <p className="mt-10 border-s-2 border-bronze/50 ps-4 text-[13px] leading-relaxed text-steel">
            {m.note}
          </p>
        </Reveal>
      </section>

      {/* Swatch library */}
      <section className="section-pad bg-graphite text-paper">
        <div className="container-site">
          <SectionHeading
            eyebrow={m.eyebrow}
            title={m.swatchesTitle}
            lead={m.swatchesLead}
            tone="dark"
          />
          <div className="mt-14 space-y-12">
            {m.swatchGroups.map((group, gi) => (
              <Reveal key={group.name} delay={gi * 80}>
                <div>
                  <h3 className="text-[11px] font-semibold tracking-[0.22em] text-bronze-soft uppercase">
                    {group.name}
                  </h3>
                  <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                    {group.swatches.map((swatch) => (
                      <li key={swatch.name}>
                        <div
                          className="aspect-[4/3] border border-paper/15 shadow-[var(--shadow-card)]"
                          style={{ backgroundColor: swatch.hex }}
                          role="img"
                          aria-label={swatch.name}
                        />
                        <p className="mt-3 text-[13px] font-medium text-paper">{swatch.name}</p>
                        <p className="text-[11px] tracking-[0.08em] text-steel" dir="ltr">
                          {swatch.hex}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sample box */}
      <section className="section-pad bg-paper-deep">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="media-card-img relative aspect-[4/3] bg-sand">
              <img
                src={images.sampleBox}
                alt={m.sampleBox.title}
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow text-bronze-ink">{m.sampleBox.eyebrow}</p>
            <h2 className="display-1 mt-5 text-ink">{m.sampleBox.title}</h2>
            <p className="lead mt-6 text-ink-soft">{m.sampleBox.text}</p>
            <ul className="mt-8 space-y-3">
              {m.sampleBox.points.map((point) => (
                <li key={point} className="flex items-center gap-3 text-[15px] font-medium text-ink">
                  <span className="h-1.5 w-1.5 shrink-0 bg-bronze" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CtaBanner locale={locale} dict={dict} />
    </>
  );
}
