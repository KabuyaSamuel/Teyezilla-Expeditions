"use client";

import type { Tour } from "@/types";

export default function TourPicker({
  tours,
  selectedIds,
  onChange,
}: {
  tours: Tour[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((v) => v !== id) : [...selectedIds, id]);
  }

  return (
    <section className="card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Included Tours & Experiences</h2>
      <p className="mt-1 text-xs text-foreground/50">
        Link the real tours/safaris/experiences this journey is built from. Shown on the public
        journey page as "This Journey Includes," each with its own View Tour link.
      </p>
      {tours.length === 0 ? (
        <p className="mt-3 text-sm text-foreground/50">No published tours yet.</p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((t) => (
            <label key={t.id} className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={selectedIds.includes(t.id)} onChange={() => toggle(t.id)} />
              {t.title}
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
