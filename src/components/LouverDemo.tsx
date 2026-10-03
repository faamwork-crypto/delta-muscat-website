"use client";

import { useId, useState } from "react";

type LouverDemoProps = {
  labels: {
    title: string;
    caption: string;
    closed: string;
    open: string;
    openLabel: string;
    closeLabel: string;
  };
};

/**
 * Interactive cross-section of a louvered pergola roof. The slider tilts the
 * slats between fully closed (full shade) and fully open (light + airflow) —
 * a small, honest demonstration of how louvered shade behaves.
 */
export default function LouverDemo({ labels }: LouverDemoProps) {
  const id = useId();
  const [t, setT] = useState(30); // 0 = closed, 100 = open
  const angle = 4 + (t / 100) * 56; // slat rotation in degrees
  const light = t / 100;

  const slatCount = 9;

  return (
    <figure className="border border-line-light bg-graphite-soft p-6 sm:p-8">
      <figcaption className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[11px] font-semibold tracking-[0.22em] text-bronze-soft uppercase">
          {labels.title}
        </span>
        <span className="text-[12px] text-steel-light">{labels.caption}</span>
      </figcaption>

      {/* Cross-section canvas */}
      <div className="relative h-44 overflow-hidden border border-line-light bg-graphite-deep sm:h-52">
        {/* sun rays — stronger as the louvres open */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: 0.12 + light * 0.5,
            backgroundImage:
              "repeating-linear-gradient(104deg, transparent 0 26px, #C9A8763D 26px 30px)",
          }}
          aria-hidden="true"
        />
        {/* sun */}
        <div
          className="absolute end-6 top-5 h-12 w-12 rounded-full transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle, #E8C28E 0%, #C9A876 70%, transparent 72%)",
            opacity: 0.35 + light * 0.65,
          }}
          aria-hidden="true"
        />

        {/* beam + slats */}
        <div className="absolute inset-x-8 top-10 sm:inset-x-12">
          <div className="h-2.5 w-full bg-[#121110]" aria-hidden="true" />
          <div className="mt-2 flex justify-between" aria-hidden="true">
            {Array.from({ length: slatCount }, (_, i) => (
              <div
                key={i}
                className="h-1.5 w-[9%] rounded-[1px] border-t border-bronze-soft/70 bg-[#2E2B25] shadow-[0_2px_6px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out"
                style={{ transform: `rotate(${angle}deg)` }}
              />
            ))}
          </div>
        </div>

        {/* ground light bands */}
        <div className="absolute inset-x-8 bottom-0 h-14 sm:inset-x-12" aria-hidden="true">
          <div
            className="h-full transition-opacity duration-300"
            style={{
              opacity: 0.1 + light * 0.38,
              backgroundImage:
                "repeating-linear-gradient(90deg, #C9A87633 0 14%, transparent 14% 18%)",
            }}
          />
        </div>
      </div>

      {/* Control */}
      <div className="mt-6">
        <label htmlFor={id} className="sr-only">
          {labels.caption}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line-light accent-[#C9A876]"
          style={{
            background: `linear-gradient(to right, #C9A876 ${t}%, rgba(247,244,238,0.16) ${t}%)`,
          }}
        />
        <div className="mt-3 flex justify-between text-[11px] font-semibold tracking-[0.16em] text-steel-light uppercase">
          <span className={t < 50 ? "text-bronze-soft" : ""}>{labels.closed}</span>
          <span className="tabular-nums">{Math.round(angle)}°</span>
          <span className={t >= 50 ? "text-bronze-soft" : ""}>{labels.open}</span>
        </div>
      </div>
    </figure>
  );
}
