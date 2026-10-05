"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/photos/hero-1.webp`,
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/photos/hero-2.webp`,
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/photos/hero-3.webp`,
];

/** Seconds each photo stays fully visible (excluding the cross-fade). */
const HOLD_SECONDS = 7;
/** Cross-fade duration in seconds — deliberately slow and calm. */
const FADE_SECONDS = 2.2;

/**
 * Hero backdrop: the three photographs cross-fade slowly, each with a very
 * subtle Ken Burns zoom that suits shaded architectural imagery. Static first
 * photo when prefers-reduced-motion is set.
 */
export default function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAnimate(true);
    const timer = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      (HOLD_SECONDS + FADE_SECONDS) * 1000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          fetchPriority={i === 0 ? "high" : undefined}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out ${
            animate ? "hero-slide-zoom" : ""
          }`}
          style={{
            opacity: i === active ? 1 : 0,
            transitionDuration: `${FADE_SECONDS}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-graphite-deep/30 via-graphite-deep/10 to-graphite-deep/85" />
    </div>
  );
}
