"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

// Collapsed by default below lg (mobile/tablet) so the footer isn't a wall
// of stacked link lists; lg:!block forces every list open on desktop,
// where the button's click handling is also disabled so it just reads as
// a plain heading, matching the original always-expanded layout there.
export default function FooterLinkGroup({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-white/10 pt-4 lg:border-0 lg:pt-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-1 text-left font-heading text-sm font-semibold uppercase tracking-wide text-white lg:pointer-events-none lg:py-0"
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform lg:hidden ${open ? "rotate-180" : ""}`}
        />
      </button>
      <ul className={`mt-3 space-y-2 pb-1 text-sm text-white/80 lg:!block lg:pb-0 ${open ? "block" : "hidden"}`}>
        {children}
      </ul>
    </div>
  );
}
