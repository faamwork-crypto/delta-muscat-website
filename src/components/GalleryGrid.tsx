"use client";

import { useState } from "react";
import MediaCard from "@/components/MediaCard";
import type { Dictionary } from "@/i18n/dictionaries/en";

type GalleryItem = Dictionary["gallery"]["items"][number];

/**
 * Client-side category filter over the concept gallery. Items are labelled
 * as concept studies — never presented as completed projects.
 */
export default function GalleryGrid({
  items,
  filters,
  conceptLabel,
  learnMore,
}: {
  items: GalleryItem[];
  filters: Dictionary["gallery"]["filters"];
  conceptLabel: string;
  learnMore: string;
}) {
  const [active, setActive] = useState<string>("all");
  const visible = active === "all" ? items : items.filter((item) => item.category === active);
  const categories = ["all", "pergolas", "parking", "shade", "metal"] as const;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={filters.all}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={active === cat}
            onClick={() => setActive(cat)}
            className={`rounded-full border px-4 py-2 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${
              active === cat
                ? "border-bronze bg-bronze text-paper"
                : "border-line text-ink-soft hover:border-ink/40 hover:text-ink"
            }`}
          >
            {filters[cat]}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, i) => (
          <MediaCard
            key={item.id}
            href="#"
            image={item.image}
            imageAlt={`${item.title} — ${item.concept}`}
            eyebrow={item.concept}
            title={item.title}
            linkLabel={learnMore}
            chip={conceptLabel}
            aspect={i % 3 === 0 ? "aspect-[4/3]" : "aspect-[4/3]"}
            tone="light"
          />
        ))}
      </div>

      {visible.length === 0 ? <p className="mt-10 text-steel">—</p> : null}
    </div>
  );
}
