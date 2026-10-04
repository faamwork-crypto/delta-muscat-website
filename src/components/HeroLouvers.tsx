"use client";

import { useEffect, useRef } from "react";

const SLAT_COUNT = 12;
/** Each slat starts closing this much of the progress after the one above it. */
const STAGGER = 0.14;
/** How far down the page (relative to viewport height) the full close happens. */
const SCROLL_RANGE = 0.55;
/**
 * Slat base angle goes past flat (90deg) so the blades visibly flip over —
 * the backface shows through and the motion reads much stronger.
 */
const MAX_ROTATE = 115;

/** Metal face of one slat: [highlight, body, shade, edge] with its own alpha. */
const FACE = {
  open: [
    [201, 168, 118, 0.14],
    [18, 60, 46, 0.1],
    [11, 42, 32, 0.26],
    [201, 168, 118, 0.2],
  ],
  closed: [
    [201, 168, 118, 0.5],
    [23, 72, 56, 0.92],
    [8, 30, 23, 0.96],
    [201, 168, 118, 0.45],
  ],
};

function slatFace(t: number) {
  const mix = (a: number, b: number) => a + (b - a) * t;
  const [ho, bo, so, eo] = FACE.open;
  const [hc, bc, sc, ec] = FACE.closed;
  const rgba = (c: number[], o: number[], i: number) =>
    `rgba(${Math.round(mix(c[0], o[0]))},${Math.round(mix(c[1], o[1]))},${Math.round(mix(c[2], o[2]))},${mix(c[3], o[3]).toFixed(3)})`;
  return `linear-gradient(180deg, ${rgba(ho, hc, 0)} 0%, ${rgba(bo, bc, 1)} 30%, ${rgba(so, sc, 2)} 82%, ${rgba(eo, ec, 3)} 100%)`;
}

/**
 * Transparent metal louvers laid over the hero image. Scrolling down rotates
 * the slats shut one after another like a roller shutter; scrolling up reopens
 * them. Purely scroll-driven — no animation timers.
 */
export default function HeroLouvers() {
  const slatRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const slats = slatRefs.current;
    if (!slats.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Write styles directly from the scroll handler: 12 elements is cheap and
    // this keeps the louvers responsive even when rAF is throttled.
    const update = () => {
      const progress = Math.min(
        1,
        Math.max(0, window.scrollY / (window.innerHeight * SCROLL_RANGE)),
      );
      slats.forEach((slat, i) => {
        if (!slat) return;
        const raw = Math.min(
          1,
          Math.max(0, progress * (1 + (SLAT_COUNT - 1) * STAGGER) - i * STAGGER),
        );
        // Ease-out with a slight overshoot-and-settle (easeOutBack): the
        // blades whip past flat and ease back, so the spin reads as a real
        // mechanical shutter instead of a fade.
        const k = 1.70158;
        const s = raw - 1;
        const t = 1 + (k + 1) * s * s * s + k * s * s;
        slat.style.transform = `rotateX(${(-MAX_ROTATE * t).toFixed(2)}deg)`;
        slat.style.backgroundImage = slatFace(Math.min(1, t));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
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
            backgroundImage: slatFace(0),
            borderBottom: "1px solid rgba(201,168,118,0.22)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 12px 18px -14px rgba(0,0,0,0.55)",
            backfaceVisibility: "visible",
          }}
        />
      ))}
    </div>
  );
}
