import type { ProductAddon } from "@/lib/productShared";

function formatDayRange(addon: ProductAddon): string {
  if (addon.extraDaysMin && addon.extraDaysMax) return `Add ${addon.extraDaysMin}–${addon.extraDaysMax} Days`;
  if (addon.extraDaysMin) return `Add ${addon.extraDaysMin}+ Days`;
  return "";
}

export default function ProductAddons({ addons }: { addons: ProductAddon[] }) {
  const upsells = addons.filter((a) => a.kind === "addon");
  const extensions = addons.filter((a) => a.kind === "extension");

  if (upsells.length === 0 && extensions.length === 0) return null;

  return (
    <>
      {upsells.length > 0 && (
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Make It Your Own</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {upsells.map((a) => (
              <div key={a.id} className="card p-5">
                <h3 className="font-heading text-base font-semibold text-foreground">{a.title}</h3>
                {a.description && <p className="mt-1.5 text-sm text-foreground/70">{a.description}</p>}
                {a.price != null && (
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {a.currency} {a.price.toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {extensions.length > 0 && (
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Extend Your Journey</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {extensions.map((a) => (
              <div key={a.id} className="card p-5">
                <h3 className="font-heading text-base font-semibold text-foreground">{a.title}</h3>
                {a.description && <p className="mt-1.5 text-sm text-foreground/70">{a.description}</p>}
                {formatDayRange(a) && (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-accent">
                    {formatDayRange(a)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
