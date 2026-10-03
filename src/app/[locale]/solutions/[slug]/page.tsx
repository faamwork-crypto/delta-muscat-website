import ButtonLink, { ArrowIcon } from "@/components/Button";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import LouverDemo from "@/components/LouverDemo";
import CtaBanner from "@/components/home/CtaBanner";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { solutionImages } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const slugs = ["pergolas", "parking-shades", "shade-structures", "metal-decoration"] as const;
type Slug = (typeof slugs)[number];

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

const metaKeys = {
  pergolas: "solutionsPergolas",
  "parking-shades": "solutionsParking",
  "shade-structures": "solutionsShade",
  "metal-decoration": "solutionsMetal",
} as const;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const meta = dict.meta[metaKeys[slug as Slug]];
  return buildMetadata(locale, meta);
}

export default async function SolutionDetailPage({ params }: { params: Params }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw) || !slugs.includes(slug as Slug)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const solution = dict.solutions[slug as Slug];
  const siblings = dict.solutions.slugList.filter((s) => s !== slug);
  const isEn = locale === "en";

  return (
    <>
      <PageHero
        eyebrow={`${solution.index} — ${dict.nav.solutions}`}
        title={solution.heroTitle}
        lead={solution.lead}
        image={solutionImages[slug]}
        imageAlt=""
      />

      {/* Overview image strip */}
      <section className="bg-paper">
        <div className="container-site">
          <Reveal>
            <div className="media-card-img relative aspect-[21/9] bg-sand">
              <img
                src={solutionImages[slug]}
                alt={solution.name}
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Editorial split: narrative + sidebar */}
      <section className="section-pad bg-paper pt-16 sm:pt-20">
        <div className="container-site grid gap-14 lg:grid-cols-[7fr_4fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow text-bronze-ink">{solution.name}</p>
              <div className="mt-6 space-y-5">
                {solution.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)} className="lead text-ink-soft">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-12">
                <h2 className="display-2 text-ink">
                  {isEn ? "The range" : "الأنواع"}
                </h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-3">
                  {solution.types.map((type, i) => (
                    <div key={type.name} className="border-t-2 border-bronze/70 pt-4">
                      <p className="text-[11px] font-semibold tracking-[0.2em] text-bronze-ink uppercase">
                        0{i + 1}
                      </p>
                      <h3 className="mt-2 text-[15px] font-semibold text-ink">{type.name}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{type.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {slug === "pergolas" ? (
              <Reveal delay={120}>
                <div className="mt-12">
                  <LouverDemo
                    labels={{
                      title: isEn ? "How louvres work" : "كيف تعمل الشرائح الدوّارة",
                      caption: isEn
                        ? "Drag between closed and open"
                        : "حرّك المؤشر بين الوضع المغلق والمفتوح",
                      closed: isEn ? "Closed — full shade" : "مغلق — ظل كامل",
                      open: isEn ? "Open — light & air" : "مفتوح — ضوء وهواء",
                      openLabel: "",
                      closeLabel: "",
                    }}
                  />
                </div>
              </Reveal>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <div className="border border-line bg-paper-deep p-7">
                <h2 className="text-[11px] font-semibold tracking-[0.22em] text-bronze-ink uppercase">
                  {isEn ? "What it includes" : "ما يشمله العمل"}
                </h2>
                <ul className="mt-5 space-y-3.5">
                  {solution.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 text-[14px] leading-relaxed text-ink-soft"
                    >
                      <span
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-bronze"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-6 border border-line p-7">
                <h2 className="text-[11px] font-semibold tracking-[0.22em] text-bronze-ink uppercase">
                  {isEn ? "Typical applications" : "تطبيقات نموذجية"}
                </h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {solution.applications.map((app) => (
                    <li key={app} className="chip">
                      {app}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={`/${locale}/contact`}
                  variant="primary"
                  className="mt-7 w-full"
                >
                  {dict.common.requestConsultation}
                </ButtonLink>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* Sibling solutions */}
      <section className="section-pad bg-paper-deep">
        <div className="container-site">
          <SectionHeading
            eyebrow={dict.nav.solutions}
            title={isEn ? "Other solutions" : "حلول أخرى"}
          />
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {siblings.map((sib, i) => {
              const item = dict.solutions[sib as Slug];
              return (
                <Reveal key={sib} delay={i * 90}>
                  <a href={`/${locale}/solutions/${sib}`} className="group block">
                    <div className="media-card-img aspect-[16/9] bg-sand">
                      <img
                        src={solutionImages[sib]}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="flex items-center justify-between border-x border-b border-line px-6 py-5">
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.22em] text-bronze-ink uppercase">
                          {item.index}
                        </p>
                        <h3 className="display-3 mt-2 text-ink">{item.name}</h3>
                      </div>
                      <ArrowIcon className="h-5 w-5 text-bronze transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </div>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBanner locale={locale} dict={dict} />
    </>
  );
}
