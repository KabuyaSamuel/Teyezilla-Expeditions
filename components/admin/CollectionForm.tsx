"use client";

import { useState } from "react";
import type { Tour } from "@/types";
import type { AdminJourneyListItem } from "@/lib/admin/data/journeys";
import type { AdminCollectionDetail } from "@/lib/admin/data/collections";
import type { MediaItem } from "@/lib/admin/data/media";
import { createCollection, updateCollection, deleteCollection } from "@/lib/admin/actions/collections";
import MediaPickerField from "./MediaPickerField";
import { useToast } from "./Toast";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function CollectionForm({
  existingCollection,
  tours,
  journeys,
  mediaItems,
}: {
  existingCollection?: AdminCollectionDetail;
  tours: Tour[];
  journeys: AdminJourneyListItem[];
  mediaItems: MediaItem[];
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState(existingCollection?.heroImage ?? "");
  const [tourIds, setTourIds] = useState<string[]>(existingCollection?.tourIds ?? []);
  const [journeyIds, setJourneyIds] = useState<string[]>(existingCollection?.journeyIds ?? []);

  function toggle(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter((v) => v !== id) : [...list, id]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const input = {
      name: String(formData.get("name") ?? ""),
      slug: existingCollection?.slug ?? "",
      description: String(formData.get("description") ?? ""),
      heroImage,
      status: String(formData.get("status") ?? "draft"),
      tourIds,
      journeyIds,
      metaTitle: String(formData.get("metaTitle") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      ogImage: String(formData.get("ogImage") ?? ""),
    };

    try {
      if (existingCollection) {
        await updateCollection(existingCollection.id, input);
      } else {
        await createCollection(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to save collection.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingCollection) return;
    if (!confirm(`Delete "${existingCollection.name}"? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteCollection(existingCollection.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to delete collection.";
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
        <h2 className="font-heading text-lg font-semibold text-foreground">Basic Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-xs font-medium text-foreground/60">Collection Name <span className="text-error">*</span></label>
            <input id="name" name="name" required defaultValue={existingCollection?.name} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <MediaPickerField id="heroImage" name="heroImage" label="Hero Image URL" value={heroImage} onChange={setHeroImage} mediaItems={mediaItems} />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="description" className="text-xs font-medium text-foreground/60">Description</label>
          <textarea id="description" name="description" defaultValue={existingCollection?.description} rows={3} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Tours in this Collection</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((t) => (
            <label key={t.id} className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={tourIds.includes(t.id)} onChange={() => toggle(tourIds, setTourIds, t.id)} />
              {t.title}
            </label>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Journeys in this Collection</h2>
        {journeys.length === 0 ? (
          <p className="mt-2 text-sm text-foreground/50">No journeys created yet.</p>
        ) : (
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {journeys.map((j) => (
              <label key={j.id} className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={journeyIds.includes(j.id)} onChange={() => toggle(journeyIds, setJourneyIds, j.id)} />
                {j.title}
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">SEO</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <label htmlFor="metaTitle" className="text-xs font-medium text-foreground/60">Meta Title</label>
            <p className="mt-0.5 text-[11px] text-foreground/40">Aim for ~50–60 characters (longer titles get truncated in Google search results).</p>
            <input id="metaTitle" name="metaTitle" defaultValue={existingCollection?.metaTitle} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="metaDescription" className="text-xs font-medium text-foreground/60">Meta Description</label>
            <p className="mt-0.5 text-[11px] text-foreground/40">Aim for ~150–160 characters (Google&rsquo;s snippet cuts off beyond this).</p>
            <textarea id="metaDescription" name="metaDescription" defaultValue={existingCollection?.metaDescription} rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="ogImage" className="text-xs font-medium text-foreground/60">Social Share Image URL</label>
            <input id="ogImage" name="ogImage" defaultValue={existingCollection?.ogImage} placeholder="https://..." className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </section>

      <section className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <select id="status" name="status" defaultValue={existingCollection?.status ?? "draft"} className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <div className="flex flex-wrap gap-3">
          {existingCollection && (
            <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
              Delete
            </button>
          )}
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? "Saving…" : "Save Collection"}
          </button>
        </div>
      </section>
    </form>
  );
}
