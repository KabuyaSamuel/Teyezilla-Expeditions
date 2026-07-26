"use client";

import type { AddonInput } from "@/lib/admin/actions/productShared";

export default function AddonsEditor({
  addons,
  onChange,
}: {
  addons: AddonInput[];
  onChange: (addons: AddonInput[]) => void;
}) {
  function update(index: number, field: keyof AddonInput, value: string | number | null) {
    onChange(addons.map((a, i) => (i === index ? { ...a, [field]: value } : a)));
  }
  function add() {
    onChange([
      ...addons,
      {
        kind: "addon",
        title: "",
        description: "",
        price: null,
        currency: "USD",
        extraDaysMin: null,
        extraDaysMax: null,
        ctaLabel: "",
      },
    ]);
  }
  function remove(index: number) {
    onChange(addons.filter((_, i) => i !== index));
  }

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">Add-ons & Extensions</h2>
        <button type="button" onClick={add} className="text-sm font-medium text-primary hover:underline">
          + Add Item
        </button>
      </div>
      <p className="mt-1 text-xs text-foreground/50">
        Add-ons are same-trip upsells (e.g. "Private Sunset Dinner"). Extensions add extra days to another
        destination (e.g. "Serengeti Extension, +3–5 days").
      </p>
      <div className="mt-4 space-y-4">
        {addons.map((a, i) => (
          <div key={i} className="rounded-xl bg-secondary/10 p-4">
            <div className="flex items-center justify-between">
              <select
                value={a.kind}
                onChange={(e) => update(i, "kind", e.target.value)}
                className="rounded-full border border-secondary/40 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="addon">Add-on</option>
                <option value="extension">Extension</option>
              </select>
              <button type="button" onClick={() => remove(i)} className="text-xs font-medium text-error hover:underline">
                Remove
              </button>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input
                value={a.title}
                onChange={(e) => update(i, "title", e.target.value)}
                placeholder="Title"
                className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                value={a.ctaLabel}
                onChange={(e) => update(i, "ctaLabel", e.target.value)}
                placeholder="CTA label"
                className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                min={0}
                value={a.price ?? ""}
                onChange={(e) => update(i, "price", e.target.value === "" ? null : Number(e.target.value))}
                placeholder="Price (optional)"
                className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {a.kind === "extension" && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    value={a.extraDaysMin ?? ""}
                    onChange={(e) => update(i, "extraDaysMin", e.target.value === "" ? null : Number(e.target.value))}
                    placeholder="Min days"
                    className="w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    min={0}
                    value={a.extraDaysMax ?? ""}
                    onChange={(e) => update(i, "extraDaysMax", e.target.value === "" ? null : Number(e.target.value))}
                    placeholder="Max days"
                    className="w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}
            </div>
            <textarea
              value={a.description}
              onChange={(e) => update(i, "description", e.target.value)}
              placeholder="Description"
              rows={2}
              className="mt-2 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
