"use client";

import { useState } from "react";
import type { BookingGuest } from "@/lib/admin/data/booking-guests";

export default function GuestRoster({
  guests,
  onAdd,
  onRemove,
}: {
  guests: BookingGuest[];
  onAdd: (input: {
    fullName: string;
    ageGroup: "adult" | "child";
    dietaryRequirements: string;
    passportNumber: string;
    nationality: string;
  }) => Promise<void>;
  onRemove: (guestId: string) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      await onAdd({
        fullName: String(formData.get("fullName") ?? ""),
        ageGroup: (formData.get("ageGroup") as "adult" | "child") ?? "adult",
        dietaryRequirements: String(formData.get("dietaryRequirements") ?? ""),
        passportNumber: String(formData.get("passportNumber") ?? ""),
        nationality: String(formData.get("nationality") ?? ""),
      });
      (e.target as HTMLFormElement).reset();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add guest.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(guestId: string) {
    setSaving(true);
    setError(null);
    try {
      await onRemove(guestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove guest.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">Guest Roster</h2>
        <button type="button" onClick={() => setShowForm((s) => !s)} className="text-sm font-medium text-primary hover:underline">
          {showForm ? "Cancel" : "+ Add Guest"}
        </button>
      </div>
      <p className="mt-1 text-xs text-foreground/50">
        Per-traveler details for a confirmed booking -- names, dietary needs, and passport info for
        operations and documentation.
      </p>

      {error && <div className="mt-3 rounded-xl bg-error/10 px-4 py-2 text-sm text-error">{error}</div>}

      {guests.length > 0 && (
        <div className="mt-4 space-y-2">
          {guests.map((g) => (
            <div key={g.id} className="flex items-start justify-between gap-3 rounded-xl bg-secondary/10 px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-foreground">
                  {g.fullName || "Unnamed guest"} <span className="text-xs font-normal text-foreground/50">({g.ageGroup})</span>
                </p>
                <div className="mt-1 space-y-0.5 text-xs text-foreground/60">
                  {g.nationality && <p>Nationality: {g.nationality}</p>}
                  {g.passportNumber && <p>Passport: {g.passportNumber}</p>}
                  {g.dietaryRequirements && <p>Dietary: {g.dietaryRequirements}</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(g.id)}
                disabled={saving}
                className="shrink-0 text-error hover:underline disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 grid gap-3 rounded-xl bg-secondary/5 p-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="text-xs font-medium text-foreground/60">Full Name <span className="text-error">*</span></label>
            <input id="fullName" name="fullName" required className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="ageGroup" className="text-xs font-medium text-foreground/60">Age Group</label>
            <select id="ageGroup" name="ageGroup" defaultValue="adult" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="adult">Adult</option>
              <option value="child">Child</option>
            </select>
          </div>
          <div>
            <label htmlFor="nationality" className="text-xs font-medium text-foreground/60">Nationality</label>
            <input id="nationality" name="nationality" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="passportNumber" className="text-xs font-medium text-foreground/60">Passport Number</label>
            <input id="passportNumber" name="passportNumber" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="dietaryRequirements" className="text-xs font-medium text-foreground/60">Dietary Requirements</label>
            <input id="dietaryRequirements" name="dietaryRequirements" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
              {saving ? "Adding…" : "Add Guest"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
