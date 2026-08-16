"use client";

import { useSyncExternalStore } from "react";

// useSyncExternalStore instead of the more obvious useState+useEffect: it
// takes an explicit SSR snapshot (always `false` below, matching what the
// server always renders since window doesn't exist there) and reconciles
// the real client value itself, with no setState call anywhere in an
// effect body to trigger react-hooks/set-state-in-effect or accidentally
// diverge from the server's render on hydration. A useState lazy
// initializer that read matchMedia directly caused exactly that
// divergence -- confirmed directly in both HeroCarousel and
// TestimonialsCarousel, a real React hydration error on any page whose
// initial client render didn't match the SSR-rendered default.
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
