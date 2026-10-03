import { ArrowIcon } from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { images } from "@/lib/images";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { BASE } from "@/lib/site";

export default function ProcessSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const p = dict.home.processSection;
  return (
    <section className="section-pad bg-paper-deep">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={p.eyebrow} title={p.title} lead={p.lead} className="max-w-2xl" />
          <Reveal delay={100}>
            <a href={`${BASE}/${locale}/process`} className="link-arrow text-bronze-ink">
              {p.cta}
              <ArrowIcon />
            </a>
          </Reveal>
        </div>

        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {p.steps.map((step, i) => (
            <Reveal key={step.title} delay={(i % 4) * 90} as="li">
              <div className="border-t-2 border-line pt-5">
                <p className="font-display text-[26px] leading-none text-bronze">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-[15px] font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120}>
          <figure className="media-card-img relative mt-16 aspect-[21/8] bg-graphite-soft">
            <img
              src={images.factory}
              alt={dict.home.intro.imageCaption}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="absolute bottom-0 end-0 bg-graphite-deep/85 px-5 py-3 text-[12px] tracking-[0.04em] text-steel-light backdrop-blur-sm">
              {dict.home.intro.imageCaption}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
