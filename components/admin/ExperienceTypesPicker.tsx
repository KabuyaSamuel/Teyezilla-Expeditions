"use client";

import type { ExperienceType } from "@/lib/experienceTypes";

export default function ExperienceTypesPicker({
  experienceTypes,
  selectedIds,
  onChange,
}: {
  experienceTypes: ExperienceType[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((v) => v !== id) : [...selectedIds, id]);
  }

  return (
    <section className="card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Experience Categories</h2>
      <p className="mt-1 text-xs text-foreground/50">
        Controls where this tour appears on the public site, e.g. the Safari or Culture category pages, and
        category search. Select at least one. These control site navigation and rarely change -- to add a
        new one, ask your developer, or edit it directly in Supabase &rarr; Table Editor &rarr;{" "}
        <code>experience_types</code>.
      </p>
      {experienceTypes.length === 0 ? (
        <p className="mt-3 text-sm text-foreground/50">No experience categories exist yet.</p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {experienceTypes.map((e) => (
            <label key={e.id} className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={selectedIds.includes(e.id)} onChange={() => toggle(e.id)} />
              {e.name}
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
