"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Fades + slides content up whenever it's in the viewport, and back out when
// it leaves — replays every time, scrolling up or down, rather than a
// reveal-once latch. Unlike animate-fadeUp (Hero, tailwind.config.ts), which
// only ever fires once on mount. Respects prefers-reduced-motion by skipping
// straight to the visible state and staying there.
export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Comp = Tag as "div";

  return (
    <Comp
      ref={ref}
      className={`transition-all duration-700 ease-smooth ${
        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Comp>
  );
}
