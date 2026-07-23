"use client";

import { useState } from "react";
import type { Destination } from "@/types";
import type { JourneyType } from "@/lib/journeys";
import type { ExperienceType } from "@/lib/experienceTypes";
import type { SafariTheme } from "@/lib/safari";
import type { AdminJourneyDetail, ItineraryDay } from "@/lib/admin/data/journeys";
import { createJourney, updateJourney, deleteJourney } from "@/lib/admin/actions/journeys";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as any).digest).startsWith("NEXT_REDIRECT");
}

export default function JourneyForm({
  existingJourney,
  destinations,
  journeyTypes,
  experienceTypes,
  safariThemes,
}: {
  existingJourney?: AdminJourneyDetail;
  destinations: Destination[];
  journeyTypes: JourneyType[];
  experienceTypes: ExperienceType[];
  safariThemes: SafariTheme[];
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    existingJourney?.itinerary?.length ? existingJourney.itinerary : [{ day: 1, title: "", description: "" }]
  );
  const [destinationIds, setDestinationIds] = useState<string[]>(existingJourney?.destinationIds ?? []);
  const [primaryDestinationId, setPrimaryDestinationId] = useState(existingJourney?.primaryDestinationId ?? "");
  const [journeyTypeIds, setJourneyTypeIds] = useState<string[]>(existingJourney?.journeyTypeIds ?? []);
  const [experienceTypeIds, setExperienceTypeIds] = useState<string[]>(existingJourney?.experienceTypeIds ?? []);
  const [safariThemeIds, setSafariThemeIds] = useState<string[]>(existingJourney?.safariThemeIds ?? []);

  function toggleId(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter((v) => v !== id) : [...list, id]);
  }

  function toggleDestination(id: string) {
    const next = destinationIds.includes(id) ? destinationIds.filter((v) => v !== id) : [...destinationIds, id];
    setDestinationIds(next);
    if (!next.includes(primaryDestinationId)) {
      setPrimaryDestinationId(next[0] ?? "");
    }
  }

  function addItineraryDay() {
    setItinerary((prev) => [...prev, { day: prev.length + 1, title: "", description: "" }]);
  }

  function updateItineraryDay(index: number, field: keyof ItineraryDay, value: string) {
    setItinerary((prev) => prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
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
      title: String(formData.get("title") ?? ""),
      slug: existingJourney?.slug ?? "",
      heroImage: String(formData.get("heroImage") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      overview: String(formData.get("overview") ?? ""),
      durationDays: Number(formData.get("durationDays") ?? 0),
      priceFrom: Number(formData.get("priceFrom") ?? 0),
      currency: String(formData.get("currency") ?? "USD"),
      difficulty: String(formData.get("difficulty") ?? "Easy"),
      inclusions: splitLines(formData.get("inclusions")),
      exclusions: splitLines(formData.get("exclusions")),
      itinerary,
      meetingPoint: String(formData.get("meetingPoint") ?? ""),
      pickupLocations: splitCommas(formData.get("pickupLocations")),
      destinationIds,
      primaryDestinationId,
      journeyTypeIds,
      experienceTypeIds,
      safariThemeIds,
      featured: formData.get("featured") === "on",
      status: String(formData.get("status") ?? "draft"),
    };

    try {
      if (existingJourney) {
        await updateJourney(existingJourney.id, input);
      } else {
        await createJourney(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to save journey.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingJourney) return;
    if (!confirm(`Delete "${existingJourney.title}"? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteJourney(existingJourney.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to delete journey.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Basic Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="text-xs font-medium text-foreground/60">Journey Title</label>
            <input id="title" name="title" required defaultValue={existingJourney?.title} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="heroImage" className="text-xs font-medium text-foreground/60">Hero Image URL</label>
            <input id="heroImage" name="heroImage" defaultValue={existingJourney?.heroImage} placeholder="https://..." className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="difficulty" className="text-xs font-medium text-foreground/60">Difficulty</label>
            <select id="difficulty" name="difficulty" defaultValue={existingJourney?.difficulty ?? "Easy"} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Easy</option>
              <option>Moderate</option>
              <option>Challenging</option>
            </select>
          </div>
          <div>
            <label htmlFor="durationDays" className="text-xs font-medium text-foreground/60">Duration (days)</label>
            <input id="durationDays" name="durationDays" type="number" min={1} defaultValue={existingJourney?.durationDays} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="priceFrom" className="text-xs font-medium text-foreground/60">Price From</label>
            <input id="priceFrom" name="priceFrom" type="number" min={0} defaultValue={existingJourney?.priceFrom} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="currency" className="text-xs font-medium text-foreground/60">Currency</label>
            <select id="currency" name="currency" defaultValue={existingJourney?.currency ?? "USD"} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>USD</option>
              <option>EUR</option>
              <option>KES</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="shortDescription" className="text-xs font-medium text-foreground/60">Short Description</label>
          <textarea id="shortDescription" name="shortDescription" defaultValue={existingJourney?.shortDescription} rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="mt-4">
          <label htmlFor="overview" className="text-xs font-medium text-foreground/60">Overview</label>
          <textarea id="overview" name="overview" defaultValue={existingJourney?.overview} rows={4} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Destinations</h2>
        <p className="mt-1 text-xs text-foreground/50">
          Select every country this journey visits, then choose which one is primary.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {destinations.map((d) => (
            <label key={d.id} className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={destinationIds.includes(d.id)} onChange={() => toggleDestination(d.id)} />
              {d.countryName}
            </label>
          ))}
        </div>
        {destinationIds.length > 0 && (
          <div className="mt-4">
            <label htmlFor="primaryDestinationId" className="text-xs font-medium text-foreground/60">Primary Destination</label>
            <select
              id="primaryDestinationId"
              value={primaryDestinationId}
              onChange={(e) => setPrimaryDestinationId(e.target.value)}
              className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:w-64"
            >
              {destinationIds.map((id) => {
                const d = destinations.find((dest) => dest.id === id);
                return <option key={id} value={id}>{d?.countryName ?? id}</option>;
              })}
            </select>
          </div>
        )}
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Journey Type, Experiences & Safari Themes</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-foreground/60">Journey Types</p>
            <div className="mt-2 space-y-1.5">
              {journeyTypes.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={journeyTypeIds.includes(t.id)} onChange={() => toggleId(journeyTypeIds, setJourneyTypeIds, t.id)} />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-foreground/60">Experience Types</p>
            <div className="mt-2 space-y-1.5">
              {experienceTypes.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={experienceTypeIds.includes(t.id)} onChange={() => toggleId(experienceTypeIds, setExperienceTypeIds, t.id)} />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-foreground/60">Safari Themes</p>
            <div className="mt-2 space-y-1.5">
              {safariThemes.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={safariThemeIds.includes(t.id)} onChange={() => toggleId(safariThemeIds, setSafariThemeIds, t.id)} />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Inclusions & Exclusions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="inclusions" className="text-xs font-medium text-foreground/60">Inclusions (one per line)</label>
            <textarea id="inclusions" name="inclusions" rows={4} defaultValue={existingJourney?.inclusions?.join("\n")} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="exclusions" className="text-xs font-medium text-foreground/60">Exclusions (one per line)</label>
            <textarea id="exclusions" name="exclusions" rows={4} defaultValue={existingJourney?.exclusions?.join("\n")} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
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
            <label htmlFor="meetingPoint" className="text-xs font-medium text-foreground/60">Meeting Point</label>
            <input id="meetingPoint" name="meetingPoint" defaultValue={existingJourney?.meetingPoint} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="pickupLocations" className="text-xs font-medium text-foreground/60">Pickup Locations (comma-separated)</label>
            <input id="pickupLocations" name="pickupLocations" defaultValue={existingJourney?.pickupLocations?.join(", ")} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Media</h2>
        <p className="mt-1 text-xs text-foreground/50">Select from the Media Library, or upload new assets there first.</p>
        <a href="/admin/media" className="btn-outline mt-3 inline-block text-sm">Open Media Library</a>
      </section>

      <section className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-3">
          <label htmlFor="featured" className="flex items-center gap-2 text-sm">
            <input id="featured" name="featured" type="checkbox" defaultChecked={existingJourney?.featured} /> Featured journey
          </label>
          <select id="status" name="status" defaultValue={existingJourney?.status ?? "draft"} className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="flex gap-3">
          {existingJourney && (
            <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
              Delete
            </button>
          )}
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? "Saving…" : "Save Journey"}
          </button>
        </div>
      </section>
    </form>
  );
}
