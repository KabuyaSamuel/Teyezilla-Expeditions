"use client";

import { useState } from "react";
import type { ItineraryDay } from "@/lib/productShared";
import { SortableList, SortableItem, arrayMoveIndex } from "./SortableList";

// Shared between TourForm and JourneyForm (previously duplicated inline in
// both, with no way to remove or reorder a day once added). `day` is
// recomputed from position on every add/remove/reorder so it always
// matches what's actually rendered, rather than trusting whatever it was
// set to when the day was first created.
function renumber(days: ItineraryDay[]): ItineraryDay[] {
  return days.map((d, i) => ({ ...d, day: i + 1 }));
}

export default function ItineraryEditor({
  itinerary,
  onChange,
}: {
  itinerary: ItineraryDay[];
  onChange: (itinerary: ItineraryDay[]) => void;
}) {
  const [ids, setIds] = useState<string[]>(() => itinerary.map(() => crypto.randomUUID()));

  function update(index: number, field: keyof ItineraryDay, value: string) {
    onChange(itinerary.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  }
  function updateMeals(index: number, value: string) {
    const meals = value.split(",").map((s) => s.trim()).filter(Boolean);
    onChange(itinerary.map((d, i) => (i === index ? { ...d, meals } : d)));
  }
  function add() {
    onChange(renumber([...itinerary, { day: itinerary.length + 1, title: "", description: "" }]));
    setIds((prev) => [...prev, crypto.randomUUID()]);
  }
  function remove(index: number) {
    onChange(renumber(itinerary.filter((_, i) => i !== index)));
    setIds((prev) => prev.filter((_, i) => i !== index));
  }
  function reorder(oldIndex: number, newIndex: number) {
    onChange(renumber(arrayMoveIndex(itinerary, oldIndex, newIndex)));
    setIds((prev) => arrayMoveIndex(prev, oldIndex, newIndex));
  }

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">Itinerary Builder</h2>
        <button type="button" onClick={add} className="text-sm font-medium text-primary hover:underline">
          + Add Day
        </button>
      </div>
      <SortableList ids={ids} onReorder={reorder}>
        <div className="mt-4 space-y-4">
          {itinerary.map((d, i) => (
            <SortableItem key={ids[i]} id={ids[i]}>
              <div className="rounded-xl bg-secondary/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Day {d.day}</p>
                  <button type="button" onClick={() => remove(i)} className="text-xs font-medium text-error hover:underline">
                    Remove
                  </button>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <input
                    value={d.fromLocation ?? ""}
                    onChange={(e) => update(i, "fromLocation", e.target.value)}
                    placeholder="From (optional)"
                    className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    value={d.toLocation ?? ""}
                    onChange={(e) => update(i, "toLocation", e.target.value)}
                    placeholder="To (optional)"
                    className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <input
                  value={d.title}
                  onChange={(e) => update(i, "title", e.target.value)}
                  placeholder="Day title"
                  className="mt-2 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  value={d.description}
                  onChange={(e) => update(i, "description", e.target.value)}
                  placeholder="What happens this day"
                  rows={2}
                  className="mt-2 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  value={d.teyezillaMoment ?? ""}
                  onChange={(e) => update(i, "teyezillaMoment", e.target.value)}
                  placeholder="Teyezilla Moment (optional highlighted callout)"
                  rows={2}
                  className="mt-2 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <input
                    value={d.overnight ?? ""}
                    onChange={(e) => update(i, "overnight", e.target.value)}
                    placeholder="Overnight (optional)"
                    className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    defaultValue={d.meals?.join(", ") ?? ""}
                    onChange={(e) => updateMeals(i, e.target.value)}
                    placeholder="Meals, comma-separated (e.g. Breakfast, Lunch, Dinner)"
                    className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableList>
    </section>
  );
}
