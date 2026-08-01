import type { Accommodation } from "@/lib/accommodations";

export default function ProductAccommodations({ accommodations }: { accommodations: Accommodation[] }) {
  if (accommodations.length === 0) return null;

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">Where You'll Stay</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accommodations.map((a) => (
          <div key={a.id} className="card p-5">
            <h3 className="font-heading text-base font-semibold text-foreground">{a.name}</h3>
            {a.tier && <span className="text-xs font-semibold uppercase tracking-wide text-accent">{a.tier}</span>}
            {a.description && <p className="mt-1.5 text-sm text-foreground/70">{a.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
