"use client";

import { useState } from "react";
import type { Tour } from "@/types";
import type { InventoryRecord } from "@/lib/admin/data/inventory";
import { createInventoryRecord, updateInventoryRecord, deleteInventoryRecord } from "@/lib/admin/actions/inventory";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function InventoryForm({
  existingRecord,
  tours,
}: {
  existingRecord?: InventoryRecord;
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
      tourId: String(formData.get("tourId") ?? ""),
      date: String(formData.get("date") ?? ""),
      capacity: Number(formData.get("capacity") ?? 0),
      bookedCount: Number(formData.get("bookedCount") ?? 0),
    };

    try {
      if (existingRecord) {
        await updateInventoryRecord(existingRecord.id, input);
      } else {
        await createInventoryRecord(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to save availability record.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingRecord) return;
    if (!confirm(`Delete this availability record for ${existingRecord.tourTitle}?`)) return;
    setSaving(true);
    try {
      await deleteInventoryRecord(existingRecord.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to delete record.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}

      <section className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label htmlFor="tourId" className="text-xs font-medium text-foreground/60">Tour</label>
          <select id="tourId" name="tourId" required defaultValue={existingRecord?.tourId} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            {tours.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="text-xs font-medium text-foreground/60">Departure Date</label>
          <input id="date" name="date" type="date" required defaultValue={existingRecord?.date} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="capacity" className="text-xs font-medium text-foreground/60">Capacity</label>
          <input id="capacity" name="capacity" type="number" min={1} required defaultValue={existingRecord?.capacity} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="bookedCount" className="text-xs font-medium text-foreground/60">Booked Count</label>
          <input id="bookedCount" name="bookedCount" type="number" min={0} defaultValue={existingRecord?.bookedCount ?? 0} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <div className="flex justify-end gap-3">
        {existingRecord && (
          <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
            Delete
          </button>
        )}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving…" : "Save Availability"}
        </button>
      </div>
    </form>
  );
}
