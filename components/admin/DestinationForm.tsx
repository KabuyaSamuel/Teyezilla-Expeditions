"use client";

import { useState } from "react";
import type { Destination } from "@/types";
import { createDestination, updateDestination, deleteDestination } from "@/lib/admin/actions/destinations";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function DestinationForm({ existingDestination }: { existingDestination?: Destination }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const input = {
      countryName: String(formData.get("countryName") ?? ""),
      slug: existingDestination?.slug ?? "",
      flagEmoji: String(formData.get("flagEmoji") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      overview: String(formData.get("overview") ?? ""),
      bestTimeToVisit: String(formData.get("bestTimeToVisit") ?? ""),
      visaInfo: String(formData.get("visaInfo") ?? ""),
      isLaunchDestination: formData.get("isLaunchDestination") === "on",
    };

    try {
      if (existingDestination) {
        await updateDestination(existingDestination.id, input);
      } else {
        await createDestination(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to save destination.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingDestination) return;
    if (
      !confirm(
        `Delete "${existingDestination.countryName}"? This also deletes every tour under this destination. This can't be undone.`
      )
    )
      return;
    setSaving(true);
    try {
      await deleteDestination(existingDestination.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to delete destination.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}

      <section className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label htmlFor="countryName" className="text-xs font-medium text-foreground/60">Country Name</label>
          <input id="countryName" name="countryName" required defaultValue={existingDestination?.countryName} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="flagEmoji" className="text-xs font-medium text-foreground/60">Flag Emoji</label>
          <input id="flagEmoji" name="flagEmoji" defaultValue={existingDestination?.flagEmoji} placeholder="🇰🇪" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="shortDescription" className="text-xs font-medium text-foreground/60">Short Description</label>
          <textarea id="shortDescription" name="shortDescription" rows={2} defaultValue={existingDestination?.shortDescription} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Overview</h2>
        <textarea id="overview" name="overview" defaultValue={existingDestination?.overview} rows={4} className="mt-3 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      </section>

      <section className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label htmlFor="bestTimeToVisit" className="text-xs font-medium text-foreground/60">Best Time to Visit</label>
          <input id="bestTimeToVisit" name="bestTimeToVisit" defaultValue={existingDestination?.bestTimeToVisit} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="visaInfo" className="text-xs font-medium text-foreground/60">Visa Information</label>
          <input id="visaInfo" name="visaInfo" defaultValue={existingDestination?.visaInfo} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Attractions, Hotels & Restaurants</h2>
        <p className="mt-1 text-xs text-foreground/50">
          Manage as tagged Media Library entries and linked tour packages until a
          dedicated sub-schema for attractions/hotels/restaurants is added.
        </p>
      </section>

      <section className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <label htmlFor="isLaunchDestination" className="flex items-center gap-2 text-sm">
          <input id="isLaunchDestination" name="isLaunchDestination" type="checkbox" defaultChecked={existingDestination?.isLaunchDestination} /> Live (open for booking)
        </label>
        <div className="flex flex-wrap gap-3">
          {existingDestination && (
            <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
              Delete
            </button>
          )}
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? "Saving…" : "Save Destination"}
          </button>
        </div>
      </section>
    </form>
  );
}
