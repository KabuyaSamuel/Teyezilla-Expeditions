import type { ItineraryDay } from "@/lib/productShared";

export default function ProductItinerary({ days, singleDay }: { days: ItineraryDay[]; singleDay: boolean }) {
  if (days.length === 0) return null;

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">Your Journey</h2>
      <div className="mt-6 space-y-6">
        {days.map((d, i) => (
          <div key={i} className="card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              {singleDay ? `Stop ${String(d.day).padStart(2, "0")}` : `Day ${String(d.day).padStart(2, "0")}`}
              {(d.fromLocation || d.toLocation) && (
                <span className="ml-2 text-foreground/50">
                  {d.fromLocation}
                  {d.fromLocation && d.toLocation ? " → " : ""}
                  {d.toLocation}
                </span>
              )}
            </p>
            <h3 className="mt-2 font-heading text-lg font-semibold text-foreground">{d.title}</h3>
            <p className="mt-2 text-sm text-foreground/70">{d.description}</p>
            {d.teyezillaMoment && (
              <div className="mt-3 rounded-xl bg-accent/10 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">Teyezilla Moment</p>
                <p className="mt-1 text-sm text-foreground/80 italic">{d.teyezillaMoment}</p>
              </div>
            )}
            {(d.overnight || (d.meals && d.meals.length > 0)) && (
              <div className="mt-4 flex flex-wrap gap-6 border-t border-secondary/20 pt-3 text-xs text-foreground/60">
                {d.overnight && (
                  <span>
                    <span className="font-semibold uppercase tracking-wide">Overnight</span> {d.overnight}
                  </span>
                )}
                {d.meals && d.meals.length > 0 && (
                  <span>
                    <span className="font-semibold uppercase tracking-wide">Meals</span> {d.meals.join(" · ")}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
