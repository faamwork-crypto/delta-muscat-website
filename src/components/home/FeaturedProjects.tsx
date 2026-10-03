import { ArrowIcon } from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { BASE } from "@/lib/site";

export default function FeaturedProjects({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const f = dict.home.featured;
  const items = dict.gallery.items.slice(0, 3);
  const categoryLabel = (key: string) =>
    key === "pergolas"
      ? dict.gallery.filters.pergolas
      : key === "parking"
        ? dict.gallery.filters.parking
        : key === "shade"
          ? dict.gallery.filters.shade
          : dict.gallery.filters.metal;

  return (
    <section className="section-pad bg-paper">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={f.eyebrow} title={f.title} lead={f.lead} className="max-w-2xl" />
          <Reveal delay={100}>
            <a href={`${BASE}/${locale}/gallery`} className="link-arrow text-bronze-ink">
              {f.cta}
              <ArrowIcon />
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {items.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 100}
              className={i === 0 ? "lg:col-span-2" : ""}
            >
              <a href={`${BASE}/${locale}/gallery`} className="group block">
                <figure
                  className={`media-card-img relative bg-graphite-soft ${
                    i === 0 ? "aspect-[21/9]" : "aspect-[4/3]"
                  }`}
                >
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                  <span className="chip chip-concept absolute end-4 top-4">{item.concept}</span>
                  <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-bronze transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right" />
                </figure>
                <div className="flex items-baseline justify-between gap-4 border-x border-b border-line px-6 py-5">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-bronze-ink uppercase">
                      {categoryLabel(item.category)}
                    </p>
                    <h3 className="display-3 mt-2 text-ink">{item.title}</h3>
                  </div>
                  <ArrowIcon className="h-5 w-5 shrink-0 text-bronze transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <p className="mt-8 border-s-2 border-bronze/50 ps-4 text-[13px] leading-relaxed text-steel">
            {dict.common.placeholderNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
