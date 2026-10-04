"use client";

import { useEffect, useRef } from "react";

const SLAT_COUNT = 12;
/** Each slat starts closing this much of the progress after the one above it. */
const STAGGER = 0.09;
/** How far down the page (relative to viewport height) the full close happens. */
const SCROLL_RANGE = 0.9;
const MAX_ROTATE = 78;

/**
 * Transparent metal louvers laid over the hero image. Scrolling down rotates
 * the slats shut, one after another, like a roller shutter closing.
 */
export default function HeroLouvers() {
  const rootRef = useRef<HTMLDivElement>(null);
  const slatRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const slats = slatRefs.current;
    if (!slats.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const progress = Math.min(
        1,
        Math.max(0, window.scrollY / (window.innerHeight * SCROLL_RANGE)),
      );
      slats.forEach((slat, i) => {
        if (!slat) return;
        const t = Math.min(
          1,
          Math.max(0, (progress * (1 + (SLAT_COUNT - 1) * STAGGER) - i * STAGGER) / 1),
        );
        slat.style.transform = `rotateX(${(-MAX_ROTATE * t).toFixed(2)}deg)`;
      });
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] flex flex-col"
      style={{ perspective: "900px" }}
    >
      {Array.from({ length: SLAT_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            slatRefs.current[i] = el;
          }}
          className="flex-1 will-change-transform"
          style={{
            transformOrigin: "top center",
            transform: "rotateX(0deg)",
            background:
              "linear-gradient(180deg, rgba(201,168,118,0.14) 0%, rgba(18,60,46,0.10) 30%, rgba(11,42,32,0.26) 82%, rgba(201,168,118,0.20) 100%)",
            borderBottom: "1px solid rgba(201,168,118,0.22)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 12px 18px -14px rgba(0,0,0,0.55)",
            backfaceVisibility: "hidden",
          }}
        />
      ))}
    </div>
  );
}
