"use client";

import { useState } from "react";
import type { Destination } from "@/types";
import type { AdminTourDetail, ItineraryDay } from "@/lib/admin/data/tours";
import { createTour, updateTour, deleteTour } from "@/lib/admin/actions/tours";

export default function TourForm({
  existingTour,
  destinations,
}: {
  existingTour?: AdminTourDetail;
  destinations: Destination[];
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    existingTour?.itinerary?.length ? existingTour.itinerary : [{ day: 1, title: "", description: "" }]
  );

  function addItineraryDay() {
    setItinerary((prev) => [...prev, { day: prev.length + 1, title: "", description: "" }]);
  }

  function updateItineraryDay(index: number, field: keyof ItineraryDay, value: string) {
    setItinerary((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const splitLines = (v: FormDataEntryValue | null) =>
      String(v ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
    const splitCommas = (v: FormDataEntryValue | null) =>
      String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);

    const input = {
      title: String(formData.get("tourTitle") ?? ""),
      slug: existingTour?.slug ?? "",
      destinationId: String(formData.get("destinationId") ?? ""),
      categoryLabel: String(formData.get("categoryLabel") ?? ""),
      difficulty: String(formData.get("difficulty") ?? "Easy"),
      durationDays: Number(formData.get("durationDays") ?? 0),
      priceFrom: Number(formData.get("priceFrom") ?? 0),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      inclusions: splitLines(formData.get("inclusions")),
      exclusions: splitLines(formData.get("exclusions")),
      itinerary,
      meetingPoint: String(formData.get("meetingPoint") ?? ""),
      pickupLocations: splitCommas(formData.get("pickupLocations")),
      featured: formData.get("featured") === "on",
      status: String(formData.get("status") ?? "draft"),
    };

    try {
      if (existingTour) {
        await updateTour(existingTour.id, input);
      } else {
        await createTour(input);
      }
      // On success the action redirects to /admin/tours; if we get here
      // without a redirect having thrown, something unexpected happened.
    } catch (err) {
      // Next.js redirect() throws a special error to trigger navigation —
      // let that propagate instead of treating it as a failure.
      if (err && typeof err === "object" && "digest" in err && String(err.digest).startsWith("NEXT_REDIRECT")) {
        throw err;
      }
      setError(err instanceof Error ? err.message : "Failed to save tour.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingTour) return;
    if (!confirm(`Delete "${existingTour.title}"? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteTour(existingTour.id);
    } catch (err) {
      if (err && typeof err === "object" && "digest" in err && String(err.digest).startsWith("NEXT_REDIRECT")) {
        throw err;
      }
      setError(err instanceof Error ? err.message : "Failed to delete tour.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>
      )}

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Basic Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tourTitle" className="text-xs font-medium text-foreground/60">Tour Title</label>
            <input id="tourTitle" name="tourTitle" required defaultValue={existingTour?.title} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="destinationId" className="text-xs font-medium text-foreground/60">Destination</label>
            <select id="destinationId" name="destinationId" required defaultValue={existingTour?.destinationId} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>{d.countryName}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="categoryLabel" className="text-xs font-medium text-foreground/60">Category</label>
            <input id="categoryLabel" name="categoryLabel" defaultValue={existingTour?.categoryLabel} placeholder="Safari, Beach, Culture..." className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="difficulty" className="text-xs font-medium text-foreground/60">Difficulty</label>
            <select id="difficulty" name="difficulty" defaultValue={existingTour?.difficulty ?? "Easy"} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Easy</option>
              <option>Moderate</option>
              <option>Challenging</option>
            </select>
          </div>
          <div>
            <label htmlFor="durationDays" className="text-xs font-medium text-foreground/60">Duration (days)</label>
            <input id="durationDays" name="durationDays" type="number" min={1} defaultValue={existingTour?.durationDays} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="priceFrom" className="text-xs font-medium text-foreground/60">Price From (USD)</label>
            <input id="priceFrom" name="priceFrom" type="number" min={0} defaultValue={existingTour?.priceFrom} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="shortDescription" className="text-xs font-medium text-foreground/60">Short Description</label>
          <textarea id="shortDescription" name="shortDescription" defaultValue={existingTour?.shortDescription} rows={3} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Inclusions & Exclusions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="inclusions" className="text-xs font-medium text-foreground/60">Inclusions (one per line)</label>
            <textarea id="inclusions" name="inclusions" rows={4} defaultValue={existingTour?.inclusions?.join("\n")} placeholder="Airport transfers&#10;All game drives&#10;Park fees" className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="exclusions" className="text-xs font-medium text-foreground/60">Exclusions (one per line)</label>
            <textarea id="exclusions" name="exclusions" rows={4} defaultValue={existingTour?.exclusions?.join("\n")} placeholder="International flights&#10;Travel insurance&#10;Tips" className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
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
                id={`itinerary-title-${i}`}
                value={d.title}
                onChange={(e) => updateItineraryDay(i, "title", e.target.value)}
                placeholder="Day title"
                className="mt-2 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                id={`itinerary-description-${i}`}
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
            <label htmlFor="meetingPoint" className="text-xs font-medium text-foreground/60">Meeting Point</label>
            <input id="meetingPoint" name="meetingPoint" defaultValue={existingTour?.meetingPoint} placeholder="Jomo Kenyatta International Airport" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="pickupLocations" className="text-xs font-medium text-foreground/60">Pickup Locations (comma-separated)</label>
            <input id="pickupLocations" name="pickupLocations" defaultValue={existingTour?.pickupLocations?.join(", ")} placeholder="Nairobi CBD hotels, JKIA" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
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

      <section className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-3">
          <label htmlFor="featured" className="flex items-center gap-2 text-sm">
            <input id="featured" name="featured" type="checkbox" defaultChecked={existingTour?.featured} /> Featured tour
          </label>
          <select id="status" name="status" defaultValue={existingTour?.status ?? "draft"} className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="flex gap-3">
          {existingTour && (
            <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
              Delete
            </button>
          )}
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? "Saving…" : "Save Tour"}
          </button>
        </div>
      </section>
    </form>
  );
}
