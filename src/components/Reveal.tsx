"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Transition delay in ms — use to stagger siblings. */
  delay?: number;
  style?: CSSProperties;
  /** Render as a different element (e.g. "li" inside lists). */
  as?: ElementType;
};

/**
 * Scroll-reveal wrapper. Adds `.is-visible` when the element enters the
 * viewport. The actual transition lives in globals.css and honours
 * prefers-reduced-motion.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  style,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}
    >
      {children}
    </Tag>
  );
}
