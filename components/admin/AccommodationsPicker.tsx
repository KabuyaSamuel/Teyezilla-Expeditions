"use client";

import type { AdminAccommodation } from "@/lib/admin/data/accommodations";

export default function AccommodationsPicker({
  accommodations,
  selectedIds,
  onChange,
}: {
  accommodations: AdminAccommodation[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((v) => v !== id) : [...selectedIds, id]);
  }

  return (
    <section className="card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Where You'll Stay</h2>
      <p className="mt-1 text-xs text-foreground/50">
        Accommodations from the library used on this product. Add new ones in{" "}
        <a href="/admin/accommodations" className="text-primary hover:underline">
          Accommodation Library
        </a>
        .
      </p>
      {accommodations.length === 0 ? (
        <p className="mt-3 text-sm text-foreground/50">No accommodations in the library yet.</p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {accommodations.map((a) => (
            <label key={a.id} className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={selectedIds.includes(a.id)} onChange={() => toggle(a.id)} />
              {a.name}
              <span className="text-xs text-foreground/50">
                ({[a.destinationName, a.tier].filter(Boolean).join(", ")})
              </span>
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
