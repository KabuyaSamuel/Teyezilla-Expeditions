"use client";

import { useState } from "react";
import Link from "next/link";
import type { PricingTier } from "@/lib/productShared";

export default function ProductPricingTiers({
  tiers,
  bookingHref,
}: {
  tiers: PricingTier[];
  bookingHref: string;
}) {
  // Middle tier is highlighted by default (typically the recommended
  // option); hovering another tier moves the highlight there instead,
  // reverting once the cursor leaves.
  const defaultHighlight = 1;
  const [hovered, setHovered] = useState<number | null>(null);
  const highlighted = hovered ?? defaultHighlight;

  if (tiers.length === 0) return null;

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">Choose Your Journey</h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {tiers.map((tier, i) => (
          <div
            key={tier.id}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={`card flex flex-col p-6 transition-colors duration-200 ${
              i === highlighted ? "border-2 border-accent" : ""
            }`}
          >
            {tier.tagline && (
              <span className="text-xs font-semibold uppercase tracking-wide text-accent">{tier.tagline}</span>
            )}
            <h3 className="mt-2 font-heading text-lg font-bold text-foreground">{tier.tierName}</h3>
            <p className="mt-1 font-heading text-2xl font-bold text-primary">
              {tier.currency} {tier.price.toLocaleString()}
              <span className="text-sm font-normal text-foreground/50"> / person</span>
            </p>
            {tier.accommodationSummary && (
              <p className="mt-2 text-sm text-foreground/70">{tier.accommodationSummary}</p>
            )}
            {tier.features.length > 0 && (
              <ul className="mt-4 flex-1 space-y-1.5 text-sm text-foreground/70">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
            <Link href={bookingHref} className="btn-primary mt-6 text-center text-sm">
              {tier.ctaLabel || `Enquire About ${tier.tierName}`}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
