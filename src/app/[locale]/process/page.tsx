import ButtonLink from "@/components/Button";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { images } from "@/lib/images";
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
  return buildMetadata(locale, dict.meta.process);
}

export default async function ProcessPage({ params }: { params: Params }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const p = dict.process;

  return (
    <>
      <PageHero
        eyebrow={p.eyebrow}
        title={p.title}
        lead={p.lead}
        image={images.factory}
        imageAlt=""
      />

      {/* Timeline */}
      <section className="section-pad bg-paper">
        <div className="container-site">
          <ol className="relative space-y-0 border-s-2 border-line ps-8 sm:ps-12">
            {p.steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={Math.min(i * 60, 200)}>
                <div className="relative border-b border-line py-8 last:border-b-0 sm:py-10">
                  <span
                    className="absolute -start-[41px] top-9 flex h-8 w-8 items-center justify-center rounded-full border-2 border-bronze bg-paper font-display text-[13px] text-bronze-ink sm:-start-[57px] sm:h-10 sm:w-10 sm:text-[15px]"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="grid gap-2 sm:grid-cols-[12rem_1fr] sm:gap-10">
                    <h2 className="flex items-baseline gap-3 text-[15px] font-semibold text-ink">
                      <span className="font-display text-[15px] text-bronze">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step.title}
                    </h2>
                    <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft">
                      {step.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Under one roof */}
      <section className="section-pad bg-graphite text-paper">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow text-bronze-soft">{p.factoryEyebrow}</p>
            <h2 className="display-1 mt-5 text-paper">{p.factoryTitle}</h2>
            <p className="lead mt-6 text-steel-light">{p.factoryText}</p>
            <ButtonLink href={`/${locale}/materials`} variant="primaryDark" className="mt-8">
              {dict.home.materialsSection.cta}
            </ButtonLink>
          </Reveal>
          <Reveal delay={120}>
            <div className="media-card-img relative aspect-[16/11] bg-graphite-soft">
              <img
                src={images.factory}
                alt={dict.home.intro.imageCaption}
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-paper-deep">
        <div className="container-site text-center">
          <Reveal>
            <h2 className="display-1 mx-auto max-w-2xl text-ink">{p.cta.title}</h2>
            <p className="lead mx-auto mt-5 max-w-xl text-ink-soft">{p.cta.text}</p>
            <ButtonLink href={`/${locale}/contact`} variant="primary" className="mt-9">
              {p.cta.primary}
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
