"use client";

import { useState } from "react";
import type { AvailabilityDate } from "@/lib/admin/data/availability";

export default function AvailabilityCalendar({
  dates,
  onAdd,
  onRemove,
}: {
  dates: AvailabilityDate[];
  onAdd: (date: string, capacity: number) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState(8);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    setSaving(true);
    setError(null);
    try {
      await onAdd(date, capacity);
      setDate("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add date.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: string) {
    if (!confirm("Remove this date? This can't be undone.")) return;
    setSaving(true);
    setError(null);
    try {
      await onRemove(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove date.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Availability Calendar</h2>
      <p className="mt-1 text-xs text-foreground/50">
        Specific departure dates and capacity. Saved immediately, independent of the form above --
        booked counts here reflect real confirmed bookings.
      </p>

      {error && <div className="mt-3 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">{error}</div>}

      {dates.length > 0 && (
        <div className="mt-4 space-y-2">
          {dates.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-3 rounded-xl bg-secondary/10 px-4 py-2 text-sm">
              <span className="font-medium text-foreground">{d.date}</span>
              <span className="text-foreground/60">
                {d.bookedCount} / {d.capacity} booked
              </span>
              <button
                type="button"
                onClick={() => handleRemove(d.id)}
                disabled={saving}
                className="text-error hover:underline disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="availabilityDate" className="text-xs font-medium text-foreground/60">Date <span className="text-error">*</span></label>
          <input
            id="availabilityDate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="availabilityCapacity" className="text-xs font-medium text-foreground/60">Capacity</label>
          <input
            id="availabilityCapacity"
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="mt-1 w-24 rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-outline text-sm disabled:opacity-50">
          {saving ? "Adding…" : "+ Add Date"}
        </button>
      </form>
    </section>
  );
}
