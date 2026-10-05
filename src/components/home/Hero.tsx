import ButtonLink, { ArrowIcon } from "@/components/Button";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import { images } from "@/lib/images";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";

/* White line icons for the hero facts bar — one per fact, in order:
   Design, Manufacturing, Installation, After-sales. */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const FACT_ICONS = [
  // Design — drafting compass
  function DesignIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" {...stroke} {...props}>
        <circle cx="12" cy="5" r="2.2" />
        <path d="M10.8 7 5.5 20M13.2 7l5.3 13M8 15.5c2.6 1.4 5.4 1.4 8 0" />
      </svg>
    );
  },
  // Manufacturing — factory with sawtooth roof
  function FactoryIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" {...stroke} {...props}>
        <path d="M3 20V9.5l5 3V9.5l5 3V9.5l5 3V20H3Zm2.5 0v-3.5h4V20M13 20v-3.5h4V20" />
        <path d="M20 9.5V5h-2.5" />
      </svg>
    );
  },
  // Installation — wrench
  function InstallIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" {...stroke} {...props}>
        <path d="M14.5 6.5a4 4 0 0 1 5-3.9l-2.6 2.6 2.4 2.4L21.9 5a4 4 0 0 1-5.2 4.9L7 19.6a2.1 2.1 0 0 1-3-3l9.6-9.7a4 4 0 0 1 .9-.4Z" />
      </svg>
    );
  },
  // After-sales — headset
  function SupportIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" {...stroke} {...props}>
        <path d="M4 13a8 8 0 0 1 16 0" />
        <rect x="3" y="13" width="4" height="6" rx="1.6" />
        <rect x="17" y="13" width="4" height="6" rx="1.6" />
        <path d="M19 19v1.2a1.8 1.8 0 0 1-1.8 1.8H13" />
      </svg>
    );
  },
];

export default function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.home.hero;
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-graphite-deep text-paper">
      <HeroSlideshow />

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
          className="anim-hero lead mt-7 max-w-2xl text-paper/90"
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
          {h.facts.map((fact, i) => {
            const Icon = FACT_ICONS[i];
            return (
              <div
                key={fact.label}
                className={`border-line-light py-6 sm:py-7 ${i % 2 === 1 ? "border-s ps-6 sm:ps-8" : ""} ${
                  i >= 2 ? "border-t lg:border-t-0 lg:border-s lg:ps-8" : ""
                }`}
              >
                {Icon ? (
                  <Icon className="h-6 w-6 text-paper sm:h-7 sm:w-7" aria-hidden="true" />
                ) : null}
                <dt className="mt-3 text-[10px] font-semibold tracking-[0.22em] text-bronze-soft uppercase sm:mt-3.5">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-[14px] font-medium text-paper">{fact.value}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
