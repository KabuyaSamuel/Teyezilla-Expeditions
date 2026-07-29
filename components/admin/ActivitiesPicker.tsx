"use client";

import type { Activity } from "@/lib/activities";

export default function ActivitiesPicker({
  activities,
  selectedIds,
  onChange,
}: {
  activities: Activity[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((v) => v !== id) : [...selectedIds, id]);
  }

  return (
    <section className="card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Activities</h2>
      <p className="mt-1 text-xs text-foreground/50">
        Reusable named activities included in this product (e.g. "Maasai Mara Game Drive").
      </p>
      {activities.length === 0 ? (
        <p className="mt-3 text-sm text-foreground/50">
          No activities in the library yet. Add some in{" "}
          <a href="/admin/activities" className="text-primary hover:underline">
            Activities Library
          </a>
          .
        </p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((a) => (
            <label key={a.id} className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={selectedIds.includes(a.id)} onChange={() => toggle(a.id)} />
              {a.name}
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
