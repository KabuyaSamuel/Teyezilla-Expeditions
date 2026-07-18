"use client";

import { useState } from "react";
import type { Tour } from "@/types";
import { destinations } from "@/lib/destinations";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export default function TourForm({ existingTour }: { existingTour?: Tour }) {
  const [saved, setSaved] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    existingTour
      ? [{ day: 1, title: "Arrival", description: existingTour.shortDescription }]
      : [{ day: 1, title: "", description: "" }]
  );

  function addItineraryDay() {
    setItinerary((prev) => [...prev, { day: prev.length + 1, title: "", description: "" }]);
  }

  function updateItineraryDay(index: number, field: keyof ItineraryDay, value: string) {
    setItinerary((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // NOTE: this mock form doesn't persist yet — wire this submit handler to
    // a Supabase insert/update against the `tours` table (and `tour_availability`
    // for the calendar) once the database is connected in Phase 4.
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {saved && (
        <div className="rounded-xl bg-success/10 px-4 py-3 text-sm text-success">
          Saved locally. Connect Supabase in Phase 4 to persist this for real.
        </div>
      )}

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Basic Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-foreground/60">Tour Title</label>
            <input defaultValue={existingTour?.title} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60">Destination</label>
            <select defaultValue={existingTour?.destinationId} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>{d.countryName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60">Category</label>
            <input defaultValue={existingTour?.categoryLabel} placeholder="Safari, Beach, Culture..." className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60">Difficulty</label>
            <select defaultValue={existingTour?.difficulty ?? "Easy"} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Easy</option>
              <option>Moderate</option>
              <option>Challenging</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60">Duration (days)</label>
            <input type="number" defaultValue={existingTour?.durationDays} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60">Price From (USD)</label>
            <input type="number" defaultValue={existingTour?.priceFrom} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs font-medium text-foreground/60">Short Description</label>
          <textarea defaultValue={existingTour?.shortDescription} rows={3} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Inclusions & Exclusions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-foreground/60">Inclusions (one per line)</label>
            <textarea rows={4} placeholder="Airport transfers&#10;All game drives&#10;Park fees" className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60">Exclusions (one per line)</label>
            <textarea rows={4} placeholder="International flights&#10;Travel insurance&#10;Tips" className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Itinerary Builder</h2>
          <button type="button" onClick={addItineraryDay} className="text-sm font-medium text-primary hover:underline">
            + Add Day
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {itinerary.map((d, i) => (
            <div key={i} className="rounded-xl bg-secondary/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Day {d.day}</p>
              <input
                value={d.title}
                onChange={(e) => updateItineraryDay(i, "title", e.target.value)}
                placeholder="Day title"
                className="mt-2 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                value={d.description}
                onChange={(e) => updateItineraryDay(i, "description", e.target.value)}
                placeholder="What happens this day"
                rows={2}
                className="mt-2 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Logistics</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-foreground/60">Meeting Point</label>
            <input placeholder="Jomo Kenyatta International Airport" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60">Pickup Locations (comma-separated)</label>
            <input placeholder="Nairobi CBD hotels, JKIA" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Media</h2>
        <p className="mt-1 text-xs text-foreground/50">
          Select from the Media Library, or upload new assets there first.
        </p>
        <a href="/admin/media" className="btn-outline mt-3 inline-block text-sm">
          Open Media Library
        </a>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Availability Calendar</h2>
        <p className="mt-1 text-xs text-foreground/50">
          Capacity per departure date. Full calendar UI and real-time sync land with the
          Inventory & Availability module and Phase 4 database connection.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <input type="date" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="number" placeholder="Capacity" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <button type="button" className="btn-outline text-sm">+ Add Date</button>
        </div>
      </section>

      <section className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked={existingTour?.featured} /> Featured tour
          </label>
          <select defaultValue={existingTour?.status ?? "draft"} className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">Save Tour</button>
      </section>
    </form>
  );
}
