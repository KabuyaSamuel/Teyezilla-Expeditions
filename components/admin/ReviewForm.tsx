"use client";

import { useState } from "react";
import type { Tour } from "@/types";
import type { AdminReview } from "@/lib/admin/data/reviews";
import { createReview, updateReview, deleteReview } from "@/lib/admin/actions/reviews";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function ReviewForm({
  existingReview,
  tours,
}: {
  existingReview?: AdminReview;
  tours: Tour[];
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const input = {
      authorName: String(formData.get("authorName") ?? ""),
      source: String(formData.get("source") ?? "Google") as "Google" | "TripAdvisor" | "GetYourGuide",
      rating: Number(formData.get("rating") ?? 5),
      quote: String(formData.get("quote") ?? ""),
      tourId: String(formData.get("tourId") ?? ""),
      isApproved: formData.get("isApproved") === "on",
    };

    try {
      if (existingReview) {
        await updateReview(existingReview.id, input);
      } else {
        await createReview(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to save review.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingReview) return;
    if (!confirm(`Delete this review from ${existingReview.authorName}? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteReview(existingReview.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to delete review.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}

      <section className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label htmlFor="authorName" className="text-xs font-medium text-foreground/60">Author Name</label>
          <input id="authorName" name="authorName" required defaultValue={existingReview?.authorName} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="source" className="text-xs font-medium text-foreground/60">Source</label>
          <select id="source" name="source" defaultValue={existingReview?.source ?? "Google"} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Google">Google</option>
            <option value="TripAdvisor">TripAdvisor</option>
            <option value="GetYourGuide">GetYourGuide</option>
          </select>
        </div>
        <div>
          <label htmlFor="rating" className="text-xs font-medium text-foreground/60">Rating</label>
          <select id="rating" name="rating" defaultValue={existingReview?.rating ?? 5} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tourId" className="text-xs font-medium text-foreground/60">Related Tour (optional)</label>
          <select id="tourId" name="tourId" defaultValue={existingReview?.tourId ?? ""} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">None</option>
            {tours.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="quote" className="text-xs font-medium text-foreground/60">Quote</label>
          <textarea id="quote" name="quote" required rows={3} defaultValue={existingReview?.quote} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <label htmlFor="isApproved" className="flex items-center gap-2 text-sm">
          <input id="isApproved" name="isApproved" type="checkbox" defaultChecked={existingReview?.isApproved ?? true} /> Approved (visible on the public site)
        </label>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        {existingReview && (
          <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
            Delete
          </button>
        )}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving…" : "Save Review"}
        </button>
      </div>
    </form>
  );
}
