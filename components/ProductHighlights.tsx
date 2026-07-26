import type { ProductHighlight } from "@/lib/productShared";

export default function ProductHighlights({ highlights }: { highlights: ProductHighlight[] }) {
  if (highlights.length === 0) return null;

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">The Highlights</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {highlights.map((h) => (
          <div key={h.id} className="card p-5">
            <h3 className="font-heading text-base font-semibold text-foreground">{h.title}</h3>
            {h.description && <p className="mt-1.5 text-sm text-foreground/70">{h.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
