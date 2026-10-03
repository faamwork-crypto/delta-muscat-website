import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CtaBanner from "@/components/home/CtaBanner";
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
  return buildMetadata(locale, dict.meta.about);
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const a = dict.about;

  return (
    <>
      <PageHero
        eyebrow={a.eyebrow}
        title={a.title}
        lead={a.lead}
        image={images.factory}
        imageAlt=""
      />

      {/* Story */}
      <section className="section-pad bg-paper">
        <div className="container-site grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow text-bronze-ink">{a.storyEyebrow}</p>
            <h2 className="display-1 mt-5 text-ink">{a.storyTitle}</h2>
            <blockquote className="mt-10 border-s-2 border-bronze ps-6 font-display text-[19px] leading-relaxed text-ink sm:text-[21px]">
              {a.quote}
            </blockquote>
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-5">
              {a.story.map((p) => (
                <p key={p.slice(0, 24)} className="lead text-ink-soft">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad bg-graphite text-paper">
        <div className="container-site">
          <SectionHeading
            eyebrow={a.valuesEyebrow}
            title={a.valuesTitle}
            tone="dark"
            align="center"
          />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map((value, i) => (
              <Reveal key={value.title} delay={i * 90}>
                <div className="border-t-2 border-bronze/60 pt-5">
                  <p className="font-display text-[15px] text-bronze-soft/80">
                    0{i + 1}
                  </p>
                  <h3 className="display-3 mt-3 text-paper">{value.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-steel-light">{value.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="section-pad bg-paper-deep">
        <div className="container-site">
          <SectionHeading eyebrow={a.approachEyebrow} title={a.approachTitle} />
          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {a.approach.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 90}>
                <div className="border-t border-line pt-6">
                  <h3 className="display-3 text-ink">
                    <span className="me-3 text-bronze">0{i + 1}</span>
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Factory */}
      <section className="section-pad bg-paper">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="media-card-img relative aspect-[16/11] bg-sand">
              <img
                src={images.showroom}
                alt={a.factoryTitle}
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow text-bronze-ink">{a.factoryEyebrow}</p>
            <h2 className="display-1 mt-5 text-ink">{a.factoryTitle}</h2>
            <p className="lead mt-6 text-ink-soft">{a.factoryText}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {a.factoryPoints.map((point) => (
                <li key={point} className="flex items-center gap-3 text-[14px] font-medium text-ink">
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
