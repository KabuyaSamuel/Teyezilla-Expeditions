"use client";

import type { Vehicle } from "@/lib/vehicles";

export default function VehiclesPicker({
  vehicles,
  selectedIds,
  onChange,
}: {
  vehicles: Vehicle[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((v) => v !== id) : [...selectedIds, id]);
  }

  return (
    <section className="card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Expedition Vehicle</h2>
      <p className="mt-1 text-xs text-foreground/50">
        Reusable named vehicles used for this product (e.g. "4x4 Safari Land Cruiser"). Add new ones in{" "}
        <a href="/admin/vehicles" className="text-primary hover:underline">
          Vehicle Library
        </a>
        .
      </p>
      {vehicles.length === 0 ? (
        <p className="mt-3 text-sm text-foreground/50">No vehicles in the library yet.</p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <label key={v.id} className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={selectedIds.includes(v.id)} onChange={() => toggle(v.id)} />
              {v.name}
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
