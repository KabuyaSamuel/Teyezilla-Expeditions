"use client";

import { useState } from "react";
import type { Destination } from "@/types";
import type { MediaItem } from "@/lib/admin/data/media";
import { createDestination, updateDestination, deleteDestination } from "@/lib/admin/actions/destinations";
import { AFRICAN_COUNTRIES, flagEmojiForCode } from "@/lib/country-codes";
import MediaPickerField from "./MediaPickerField";
import { useToast } from "./Toast";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function DestinationForm({
  existingDestination,
  mediaItems,
}: {
  existingDestination?: Destination;
  mediaItems: MediaItem[];
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState(existingDestination?.heroImage ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const input = {
      countryName: String(formData.get("countryName") ?? ""),
      slug: existingDestination?.slug ?? "",
      flagEmoji: String(formData.get("flagEmoji") ?? ""),
      heroImage,
      shortDescription: String(formData.get("shortDescription") ?? ""),
      overview: String(formData.get("overview") ?? ""),
      bestTimeToVisit: String(formData.get("bestTimeToVisit") ?? ""),
      visaInfo: String(formData.get("visaInfo") ?? ""),
      isLaunchDestination: formData.get("isLaunchDestination") === "on",
      featured: formData.get("featured") === "on",
      metaTitle: String(formData.get("metaTitle") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      ogImage: String(formData.get("ogImage") ?? ""),
    };

    try {
      if (existingDestination) {
        await updateDestination(existingDestination.id, input);
      } else {
        await createDestination(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to save destination.";
      setError(message);
      toast.error(message);
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
      const message = err instanceof Error ? err.message : "Failed to delete destination.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}
      <p className="text-xs text-foreground/50">Fields marked with <span className="text-error">*</span> are required.</p>

      <section className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label htmlFor="countryName" className="text-xs font-medium text-foreground/60">Country Name <span className="text-error">*</span></label>
          <input id="countryName" name="countryName" required defaultValue={existingDestination?.countryName} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="flagEmoji" className="text-xs font-medium text-foreground/60">Country Flag</label>
          <select
            id="flagEmoji"
            name="flagEmoji"
            defaultValue={existingDestination?.flagEmoji ?? ""}
            className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a country</option>
            {AFRICAN_COUNTRIES.map((c) => {
              // Zanzibar isn't a sovereign country (part of Tanzania, with
              // its own ISO code), so it doesn't have a real flag emoji --
              // existing destination rows use 🏝️ for it, kept here so
              // editing that row round-trips instead of matching no option.
              const emoji = c.name === "Zanzibar" ? "🏝️" : flagEmojiForCode(c.code);
              return (
                <option key={c.code} value={emoji}>
                  {emoji} {c.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="sm:col-span-2">
          <MediaPickerField id="heroImage" name="heroImage" label="Hero Image" value={heroImage} onChange={setHeroImage} mediaItems={mediaItems} />
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

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">SEO</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <label htmlFor="metaTitle" className="text-xs font-medium text-foreground/60">Meta Title</label>
            <p className="mt-0.5 text-[11px] text-foreground/40">Aim for ~50–60 characters (longer titles get truncated in Google search results).</p>
            <input id="metaTitle" name="metaTitle" defaultValue={existingDestination?.metaTitle} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="metaDescription" className="text-xs font-medium text-foreground/60">Meta Description</label>
            <p className="mt-0.5 text-[11px] text-foreground/40">Aim for ~150–160 characters (Google&rsquo;s snippet cuts off beyond this).</p>
            <textarea id="metaDescription" name="metaDescription" defaultValue={existingDestination?.metaDescription} rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="ogImage" className="text-xs font-medium text-foreground/60">Social Share Image URL</label>
            <input id="ogImage" name="ogImage" defaultValue={existingDestination?.ogImage} placeholder="https://..." className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </section>

      <section className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="isLaunchDestination" className="flex items-center gap-2 text-sm">
            <input id="isLaunchDestination" name="isLaunchDestination" type="checkbox" defaultChecked={existingDestination?.isLaunchDestination} /> Live (open for booking)
          </label>
          <label htmlFor="featured" className="flex items-center gap-2 text-sm">
            <input id="featured" name="featured" type="checkbox" defaultChecked={existingDestination?.featured} /> Featured on homepage
          </label>
        </div>
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
