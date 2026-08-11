import Link from "next/link";

export default function StatCard({
  label,
  value,
  sublabel,
  accent = false,
  href,
}: {
  label: string;
  value: string;
  sublabel?: string;
  accent?: boolean;
  // Optional: links the whole card through to the full view of whatever
  // data it's summarizing (e.g. "Total Bookings" -> /admin/bookings).
  // Omitted on pages like Reports where the stat has no single source
  // list to drill into.
  href?: string;
}) {
  const content = (
    <>
      <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">{label}</p>
      <p className={`mt-2 font-heading text-3xl font-bold ${accent ? "text-accent" : "text-primary"}`}>
        {value}
      </p>
      {sublabel && <p className="mt-1 text-xs text-foreground/50">{sublabel}</p>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="card block border border-transparent p-5 transition-colors hover:border-primary/30">
        {content}
      </Link>
    );
  }

  return <div className="card p-5">{content}</div>;
}
