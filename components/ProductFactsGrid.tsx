export default function ProductFactsGrid({ facts }: { facts: { label: string; value: string }[] }) {
  const visible = facts.filter((f) => f.value);
  if (visible.length === 0) return null;

  return (
    <div className="card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Details at a Glance</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {visible.map((f) => (
          <div key={f.label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-foreground/50">{f.label}</dt>
            <dd className="mt-0.5 text-sm text-foreground">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
