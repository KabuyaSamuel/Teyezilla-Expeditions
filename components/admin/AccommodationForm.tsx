"use client";

import { useState } from "react";
import type { AdminAccommodation } from "@/lib/admin/data/accommodations";
import { createAccommodation, updateAccommodation, deleteAccommodation } from "@/lib/admin/actions/accommodations";
import type { Destination } from "@/types";
import { useToast } from "./Toast";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function AccommodationForm({
  destinations,
  existingAccommodation,
}: {
  destinations: Destination[];
  existingAccommodation?: AdminAccommodation;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const input = {
      destinationId: String(formData.get("destinationId") ?? ""),
      name: String(formData.get("name") ?? ""),
      slug: existingAccommodation?.slug ?? "",
      description: String(formData.get("description") ?? ""),
      heroImage: String(formData.get("heroImage") ?? ""),
      tier: String(formData.get("tier") ?? ""),
      status: String(formData.get("status") ?? "draft"),
      displayOrder: Number(formData.get("displayOrder") ?? 0),
    };

    try {
      if (existingAccommodation) {
        await updateAccommodation(existingAccommodation.id, input);
      } else {
        await createAccommodation(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to save accommodation.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingAccommodation) return;
    if (!confirm(`Delete "${existingAccommodation.name}"? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteAccommodation(existingAccommodation.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to delete accommodation.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}
      <p className="text-xs text-foreground/50">Fields marked with <span className="text-error">*</span> are required.</p>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Accommodation Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-xs font-medium text-foreground/60">Name <span className="text-error">*</span></label>
            <input id="name" name="name" required defaultValue={existingAccommodation?.name} placeholder="Samburu Camp" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="destinationId" className="text-xs font-medium text-foreground/60">Destination <span className="text-error">*</span></label>
            <select id="destinationId" name="destinationId" required defaultValue={existingAccommodation?.destinationId ?? ""} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="" disabled>Select a destination</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>{d.countryName}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tier" className="text-xs font-medium text-foreground/60">Tier</label>
            <select id="tier" name="tier" defaultValue={existingAccommodation?.tier ?? ""} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Unspecified</option>
              <option value="Budget">Budget</option>
              <option value="Mid-Range">Mid-Range</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
          <div>
            <label htmlFor="heroImage" className="text-xs font-medium text-foreground/60">Hero Image URL</label>
            <input id="heroImage" name="heroImage" defaultValue={existingAccommodation?.heroImage} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="displayOrder" className="text-xs font-medium text-foreground/60">Display Order</label>
            <input id="displayOrder" name="displayOrder" type="number" min={0} defaultValue={existingAccommodation?.displayOrder ?? 0} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="description" className="text-xs font-medium text-foreground/60">Description</label>
          <textarea id="description" name="description" defaultValue={existingAccommodation?.description} rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <select id="status" name="status" defaultValue={existingAccommodation?.status ?? "draft"} className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <div className="flex flex-wrap gap-3">
          {existingAccommodation && (
            <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
              Delete
            </button>
          )}
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? "Saving…" : "Save Accommodation"}
          </button>
        </div>
      </section>
    </form>
  );
}
