import type { Vehicle } from "@/lib/vehicles";

export default function ProductVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  if (vehicles.length === 0) return null;

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">Expedition Vehicle</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {vehicles.map((v) => (
          <div key={v.id} className="card p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground">{v.name}</h3>
            {v.vehicleType && <p className="text-sm text-foreground/60">{v.vehicleType}{v.seats ? ` · ${v.seats} seats` : ""}</p>}
            {v.description && <p className="mt-2 text-sm text-foreground/70">{v.description}</p>}
            {v.features.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-sm text-foreground/70">
                {v.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
