import Link from "next/link";
import type { ProductAddon } from "@/lib/productShared";

function formatDayRange(addon: ProductAddon): string {
  if (addon.extraDaysMin && addon.extraDaysMax) return `Add ${addon.extraDaysMin}–${addon.extraDaysMax} Days`;
  if (addon.extraDaysMin) return `Add ${addon.extraDaysMin}+ Days`;
  return "";
}

function hrefForAddon(bookingHref: string, addonId: string): string {
  return `${bookingHref}${bookingHref.includes("?") ? "&" : "?"}addon=${addonId}`;
}

export default function ProductAddons({ addons, bookingHref }: { addons: ProductAddon[]; bookingHref: string }) {
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
              <div key={a.id} className="card flex h-full flex-col p-5">
                <h3 className="font-heading text-base font-semibold text-foreground">{a.title}</h3>
                {a.description && <p className="mt-1.5 text-sm text-foreground/70">{a.description}</p>}
                <div className="mt-auto pt-2">
                  {a.price != null && (
                    <p className="text-sm font-semibold text-primary">
                      {a.currency} {a.price.toLocaleString()}
                    </p>
                  )}
                  <Link href={hrefForAddon(bookingHref, a.id)} className="btn-outline mt-3 block text-center text-sm">
                    {a.ctaLabel || `Add ${a.title}`}
                  </Link>
                </div>
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
              <div key={a.id} className="card flex h-full flex-col p-5">
                <h3 className="font-heading text-base font-semibold text-foreground">{a.title}</h3>
                {a.description && <p className="mt-1.5 text-sm text-foreground/70">{a.description}</p>}
                <div className="mt-auto pt-2">
                  {formatDayRange(a) && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {formatDayRange(a)}
                    </p>
                  )}
                  <Link href={bookingHref} className="btn-outline mt-3 block text-center text-sm">
                    {a.ctaLabel || `Ask About ${a.title}`}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
