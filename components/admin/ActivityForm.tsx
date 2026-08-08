"use client";

import { useState } from "react";
import type { AdminActivity } from "@/lib/admin/data/activities";
import { createActivity, updateActivity, deleteActivity } from "@/lib/admin/actions/activities";
import { useToast } from "./Toast";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function ActivityForm({ existingActivity }: { existingActivity?: AdminActivity }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const input = {
      name: String(formData.get("name") ?? ""),
      slug: existingActivity?.slug ?? "",
      description: String(formData.get("description") ?? ""),
      icon: String(formData.get("icon") ?? ""),
      displayOrder: Number(formData.get("displayOrder") ?? 0),
    };

    try {
      if (existingActivity) {
        await updateActivity(existingActivity.id, input);
      } else {
        await createActivity(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to save activity.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingActivity) return;
    if (!confirm(`Delete "${existingActivity.name}"? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteActivity(existingActivity.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to delete activity.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Activity Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-xs font-medium text-foreground/60">Name</label>
            <input id="name" name="name" required defaultValue={existingActivity?.name} placeholder="Maasai Mara Game Drive" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="icon" className="text-xs font-medium text-foreground/60">Icon (optional)</label>
            <input id="icon" name="icon" defaultValue={existingActivity?.icon} placeholder="e.g. an emoji or icon name" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="displayOrder" className="text-xs font-medium text-foreground/60">Display Order</label>
            <input id="displayOrder" name="displayOrder" type="number" min={0} defaultValue={existingActivity?.displayOrder ?? 0} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="description" className="text-xs font-medium text-foreground/60">Description</label>
          <textarea id="description" name="description" defaultValue={existingActivity?.description} rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card flex flex-wrap items-center justify-end gap-3 p-6">
        {existingActivity && (
          <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
            Delete
          </button>
        )}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving…" : "Save Activity"}
        </button>
      </section>
    </form>
  );
}
