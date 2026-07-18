export default function StatCard({
  label,
  value,
  sublabel,
  accent = false,
}: {
  label: string;
  value: string;
  sublabel?: string;
  accent?: boolean;
}) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">{label}</p>
      <p className={`mt-2 font-heading text-3xl font-bold ${accent ? "text-accent" : "text-primary"}`}>
        {value}
      </p>
      {sublabel && <p className="mt-1 text-xs text-foreground/50">{sublabel}</p>}
    </div>
  );
}
