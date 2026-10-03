import ButtonLink, { ArrowIcon } from "@/components/Button";
import { images } from "@/lib/images";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";

export default function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.home.hero;
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-graphite-deep text-paper">
      <img
        src={images.hero}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="anim-hero-fade absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-graphite-deep/30 via-graphite-deep/10 to-graphite-deep/85"
        aria-hidden="true"
      />

      <div className="container-site relative pt-44 sm:pt-52">
        <p className="anim-hero eyebrow text-bronze-soft" style={{ animationDelay: "150ms" }}>
          {h.eyebrow}
        </p>
        <h1
          className="anim-hero display-hero mt-7 max-w-4xl text-paper"
          style={{ animationDelay: "300ms" }}
        >
          {h.title}
        </h1>
        <p
          className="anim-hero lead mt-7 max-w-2xl text-steel-light"
          style={{ animationDelay: "450ms" }}
        >
          {h.lead}
        </p>

        <div
          className="anim-hero mt-10 flex flex-col gap-4 sm:flex-row"
          style={{ animationDelay: "600ms" }}
        >
          <ButtonLink href={`/${locale}/solutions`} variant="primaryDark">
            {h.ctaPrimary}
          </ButtonLink>
          <ButtonLink href={`/${locale}/contact`} variant="outlineLight">
            {h.ctaSecondary}
          </ButtonLink>
        </div>

        <p
          className="anim-hero mt-12 hidden items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-steel uppercase sm:flex"
          style={{ animationDelay: "800ms" }}
        >
          <ArrowIcon className="h-3.5 w-3.5 rotate-90" />
          {h.scrollHint}
        </p>
      </div>

      {/* Facts bar */}
      <div className="anim-hero relative mt-10 border-t border-paper/15" style={{ animationDelay: "750ms" }}>
        <dl className="container-site grid grid-cols-2 lg:grid-cols-4">
          {h.facts.map((fact, i) => (
            <div
              key={fact.label}
              className={`border-line-light py-6 sm:py-7 ${i % 2 === 1 ? "border-s ps-6 sm:ps-8" : ""} ${
                i >= 2 ? "border-t lg:border-t-0 lg:border-s lg:ps-8" : ""
              }`}
            >
              <dt className="text-[10px] font-semibold tracking-[0.22em] text-bronze-soft uppercase">
                {fact.label}
              </dt>
              <dd className="mt-2 text-[14px] font-medium text-paper">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
