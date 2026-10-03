import { ArrowIcon } from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { sectorImages } from "@/lib/images";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";

export default function SectorsSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = dict.home.sectorsSection;
  return (
    <section className="section-pad bg-graphite-deep text-paper">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={s.eyebrow}
            title={s.title}
            lead={s.lead}
            tone="dark"
            className="max-w-2xl"
          />
          <Reveal delay={100}>
            <a href={`/${locale}/sectors`} className="link-arrow text-bronze-soft">
              {s.cta}
              <ArrowIcon />
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {dict.sectors.items.map((sector, i) => (
            <Reveal key={sector.id} delay={(i % 5) * 80}>
              <a
                href={`/${locale}/sectors#${sector.id}`}
                className="group block"
                aria-label={sector.name}
              >
                <div className="media-card-img aspect-[3/4] bg-graphite-soft">
                  <img
                    src={sectorImages[sector.id]}
                    alt={sector.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <span
                    className="absolute inset-0 bg-gradient-to-t from-graphite-deep/90 via-graphite-deep/20 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="block text-[11px] font-semibold tracking-[0.2em] text-bronze-soft uppercase">
                      0{i + 1}
                    </span>
                    <span className="mt-2 block text-[15px] font-semibold text-paper">
                      {sector.name}
                    </span>
                    <span className="mt-1 block text-[12px] text-steel-light opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {sector.short}
                    </span>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
