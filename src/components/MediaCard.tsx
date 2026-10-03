import Link from "next/link";
import { ArrowIcon } from "@/components/Button";

type MediaCardProps = {
  href: string;
  image: string;
  imageAlt: string;
  index?: string;
  eyebrow?: string;
  title: string;
  text?: string;
  linkLabel: string;
  chip?: string;
  aspect?: string;
  tone?: "light" | "dark";
  priority?: boolean;
};

/**
 * The workhorse card: large architectural imagery, an index number, a title
 * and an arrow link. Used for solutions, sectors and gallery items.
 */
export default function MediaCard({
  href,
  image,
  imageAlt,
  index,
  eyebrow,
  title,
  text,
  linkLabel,
  chip,
  aspect = "aspect-[4/3]",
  tone = "light",
  priority = false,
}: MediaCardProps) {
  const isDark = tone === "dark";
  return (
    <Link href={href} className="group block h-full">
      <article className="flex h-full flex-col">
        <div className={`media-card-img relative ${aspect} bg-graphite-soft`}>
          <img
            src={image}
            alt={imageAlt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
          {chip ? (
            <span className="chip chip-concept absolute end-4 top-4">{chip}</span>
          ) : null}
          <span
            className={`absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-bronze transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right`}
          />
        </div>

        <div
          className={`flex flex-1 flex-col border-x border-b px-6 py-6 sm:px-7 ${
            isDark ? "border-line-light bg-graphite-soft" : "border-line bg-paper"
          }`}
        >
          {(index || eyebrow) && (
            <p
              className={`text-[11px] font-semibold tracking-[0.24em] uppercase ${
                isDark ? "text-bronze-soft" : "text-bronze-ink"
              }`}
            >
              {index ? <span className="me-2">{index}</span> : null}
              {eyebrow}
            </p>
          )}
          <h3 className={`display-3 mt-3 ${isDark ? "text-paper" : "text-ink"}`}>{title}</h3>
          {text ? (
            <p className={`mt-3 text-[15px] leading-relaxed ${isDark ? "text-steel-light" : "text-ink-soft"}`}>
              {text}
            </p>
          ) : null}
          <span
            className={`link-arrow mt-5 pt-1 ${isDark ? "text-bronze-soft" : "text-bronze-ink"}`}
          >
            {linkLabel}
            <ArrowIcon />
          </span>
        </div>
      </article>
    </Link>
  );
}
