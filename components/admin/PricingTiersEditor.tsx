"use client";

import type { PricingTierInput } from "@/lib/admin/actions/productShared";

export default function PricingTiersEditor({
  tiers,
  onChange,
}: {
  tiers: PricingTierInput[];
  onChange: (tiers: PricingTierInput[]) => void;
}) {
  function update(index: number, field: keyof PricingTierInput, value: string | number | string[]) {
    onChange(tiers.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  }
  function add() {
    onChange([
      ...tiers,
      { tierName: "", tagline: "", price: 0, currency: "USD", accommodationSummary: "", features: [], ctaLabel: "" },
    ]);
  }
  function remove(index: number) {
    onChange(tiers.filter((_, i) => i !== index));
  }

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">Pricing Tiers</h2>
        <button type="button" onClick={add} className="text-sm font-medium text-primary hover:underline">
          + Add Tier
        </button>
      </div>
      <p className="mt-1 text-xs text-foreground/50">
        Optional — leave empty to show a single "from" price instead (e.g. Luxury / Signature / Private Collection).
      </p>
      <div className="mt-4 space-y-4">
        {tiers.map((t, i) => (
          <div key={i} className="rounded-xl bg-secondary/10 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Tier {i + 1}</p>
              <button type="button" onClick={() => remove(i)} className="text-xs font-medium text-error hover:underline">
                Remove
              </button>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input
                value={t.tierName}
                onChange={(e) => update(i, "tierName", e.target.value)}
                placeholder="Tier name (e.g. Luxury)"
                className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                value={t.tagline}
                onChange={(e) => update(i, "tagline", e.target.value)}
                placeholder="Tagline (e.g. Teyezilla's Choice)"
                className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                min={0}
                value={t.price}
                onChange={(e) => update(i, "price", Number(e.target.value))}
                placeholder="Price"
                className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                value={t.ctaLabel}
                onChange={(e) => update(i, "ctaLabel", e.target.value)}
                placeholder="CTA label (e.g. Enquire About the Signature Journey)"
                className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <input
              value={t.accommodationSummary}
              onChange={(e) => update(i, "accommodationSummary", e.target.value)}
              placeholder="Accommodation summary"
              className="mt-2 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              value={t.features.join("\n")}
              onChange={(e) =>
                update(i, "features", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))
              }
              placeholder="Features (one per line)"
              rows={3}
              className="mt-2 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
