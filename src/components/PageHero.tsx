import Reveal from "@/components/Reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Optional backdrop image (shown at low opacity over graphite). */
  image?: string;
  imageAlt?: string;
};

/**
 * Shared dark page banner. Every inner page starts with this so the
 * transparent header always begins over a dark surface.
 */
export default function PageHero({ eyebrow, title, lead, image, imageAlt = "" }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-graphite-deep pt-[72px] text-paper lg:pt-[84px]">
      {image ? (
        <>
          <img
            src={image}
            alt={imageAlt}
            className="anim-hero-fade absolute inset-0 h-full w-full object-cover opacity-[0.28]"
            aria-hidden={imageAlt ? undefined : true}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-graphite-deep/60 via-graphite-deep/70 to-graphite-deep" />
        </>
      ) : (
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent 0 42px, #C9A87622 42px 43px)",
          }}
          aria-hidden="true"
        />
      )}

      <div className="container-site relative pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
        <Reveal>
          <p className="eyebrow text-bronze-soft">{eyebrow}</p>
          <h1 className="display-1 mt-6 max-w-3xl text-paper">{title}</h1>
          {lead ? (
            <p className="lead mt-6 max-w-2xl text-steel-light">{lead}</p>
          ) : null}
        </Reveal>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bronze/50 to-transparent" />
    </section>
  );
}
