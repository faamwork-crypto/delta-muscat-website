import MediaCard from "@/components/MediaCard";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { solutionImages } from "@/lib/images";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";

export default function SolutionsGrid({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = dict.home.solutionsSection;
  const learnMore = dict.common.learnMore;

  return (
    <section className="section-pad bg-paper-deep">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={s.eyebrow} title={s.title} lead={s.lead} className="max-w-2xl" />
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {dict.solutions.slugList.map((slug, i) => {
            const item = dict.solutions[slug as "pergolas"];
            return (
              <Reveal key={slug} delay={(i % 2) * 120}>
                <MediaCard
                  href={`/${locale}/solutions/${slug}`}
                  image={solutionImages[slug]}
                  imageAlt={item.name}
                  index={item.index}
                  title={item.name}
                  text={item.short}
                  linkLabel={learnMore}
                  aspect="aspect-[16/10]"
                  priority={i < 2}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
