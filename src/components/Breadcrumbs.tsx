import Link from "next/link";
import { BASE } from "@/lib/site";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumb trail shared by category and subcategory pages. Direction-safe:
 * the "/" separators are neutral, so the same markup serves LTR and RTL.
 */
export default function Breadcrumbs({
  items,
  ariaLabel = "Breadcrumb",
}: {
  items: Crumb[];
  ariaLabel?: string;
}) {
  return (
    <nav aria-label={ariaLabel} className="border-b border-line bg-paper-deep">
      <ol className="container-site flex flex-wrap items-center gap-x-2 gap-y-1 py-4 text-[12px] font-medium tracking-[0.04em]">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 ? (
              <span className="text-bronze/70" aria-hidden="true">
                /
              </span>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="text-ink-soft transition-colors hover:text-bronze-ink"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-bronze-ink" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Convenience builder: localized Home crumb. */
export function homeCrumb(locale: string, homeLabel: string): Crumb {
  return { label: homeLabel, href: `${BASE}/${locale}` };
}
