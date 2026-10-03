import { ArrowIcon } from "@/components/Button";
import Reveal from "@/components/Reveal";
import { images } from "@/lib/images";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";

export default function Intro({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.intro;
  return (
    <section className="section-pad bg-paper">
      <div className="container-site grid items-start gap-12 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <Reveal className="relative">
          <div className="media-card-img relative aspect-[4/5] bg-sand">
            <img
              src={images.factory}
              alt={t.imageCaption}
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="mt-4 flex items-center gap-3 text-[12px] tracking-[0.04em] text-steel">
            <span className="inline-block h-px w-6 bg-bronze" aria-hidden="true" />
            {t.imageCaption}
          </p>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow text-bronze-ink">{t.eyebrow}</p>
            <h2 className="display-1 mt-5 text-ink">{t.title}</h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-7 space-y-5">
              {t.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="lead text-ink-soft">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <div className="mt-10 divide-y divide-line border-t border-line">
            {t.points.map((point, i) => (
              <Reveal key={point.title} delay={i * 100}>
                <div className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <h3 className="flex items-baseline gap-3 text-[13px] font-semibold tracking-[0.06em] text-ink uppercase">
                    <span className="text-bronze">0{i + 1}</span>
                    {point.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-ink-soft">{point.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <a
              href={`/${locale}/about`}
              className="link-arrow mt-8 text-bronze-ink"
            >
              {t.cta}
              <ArrowIcon />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
