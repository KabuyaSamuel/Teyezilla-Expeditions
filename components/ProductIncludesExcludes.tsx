export default function ProductIncludesExcludes({
  inclusions,
  exclusions,
}: {
  inclusions: string[];
  exclusions: string[];
}) {
  if (inclusions.length === 0 && exclusions.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {inclusions.length > 0 && (
        <div className="card p-6">
          <h3 className="font-heading text-base font-semibold text-foreground">What's Included</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-foreground/70">
            {inclusions.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-accent">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {exclusions.length > 0 && (
        <div className="card p-6">
          <h3 className="font-heading text-base font-semibold text-foreground">Not Included</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-foreground/70">
            {exclusions.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-foreground/40">×</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
