import { btnClass, ArrowIcon } from "@/components/Button";
import Reveal from "@/components/Reveal";
import { images } from "@/lib/images";
import { site } from "@/lib/site";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";

/**
 * Full-width consultation invitation, shared by home, about and process pages.
 */
export default function CtaBanner({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const cta = dict.cta;
  return (
    <section className="relative overflow-hidden bg-graphite-deep text-paper">
      <img
        src={images.cta}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="anim-hero-fade absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-graphite-deep/70 via-graphite-deep/55 to-graphite-deep/85"
        aria-hidden="true"
      />
      <div className="container-site relative py-24 text-center sm:py-32">
        <Reveal>
          <h2 className="display-1 mx-auto max-w-3xl text-paper">{cta.title}</h2>
          <p className="lead mx-auto mt-6 max-w-2xl text-steel-light">{cta.text}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={`/${locale}/contact`} className={btnClass("primaryDark")}>
              {cta.primary}
            </a>
            <a href={site.headOfficePhoneHref} className={btnClass("outlineLight")}>
              {cta.secondary}
              <span dir="ltr">{site.headOfficePhone}</span>
            </a>
          </div>
          <p className="mt-10 flex items-center justify-center gap-3 text-[12px] tracking-[0.06em] text-steel">
            <span>{site.factoryAddress}</span>
            <span className="hidden h-px w-6 bg-bronze sm:inline-block" aria-hidden="true" />
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-paper">
              {site.email}
            </a>
          </p>
          <ArrowIcon className="mx-auto mt-10 hidden h-5 w-5 rotate-90 text-bronze-soft sm:block" />
        </Reveal>
      </div>
    </section>
  );
}
