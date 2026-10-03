import { ArrowIcon } from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { images, materialImages } from "@/lib/images";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { BASE } from "@/lib/site";

export default function MaterialsSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const m = dict.home.materialsSection;
  return (
    <section className="section-pad bg-paper">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={m.eyebrow} title={m.title} lead={m.lead} className="max-w-2xl" />
          <Reveal delay={100}>
            <a href={`${BASE}/${locale}/materials`} className="link-arrow text-bronze-ink">
              {m.cta}
              <ArrowIcon />
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dict.materials.categories.map((category, i) => (
            <Reveal key={category.name} delay={(i % 3) * 90}>
              <a href={`${BASE}/${locale}/materials`} className="group block h-full">
                <div className="media-card-img aspect-[4/3] bg-sand">
                  <img
                    src={materialImages[i]}
                    alt={category.name}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h3 className="display-3 mt-5 text-ink">{category.name}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{category.text}</p>
              </a>
            </Reveal>
          ))}

          {/* Sample-box feature tile */}
          <Reveal delay={180}>
            <a href={`${BASE}/${locale}/materials`} className="group block h-full">
              <div className="media-card-img aspect-[4/3] bg-sand">
                <img
                  src={images.sampleBox}
                  alt={dict.materials.sampleBox.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="mt-5 text-[11px] font-semibold tracking-[0.22em] text-bronze-ink uppercase">
                {dict.materials.sampleBox.eyebrow}
              </p>
              <h3 className="display-3 mt-2 text-ink">{dict.materials.sampleBox.title}</h3>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
