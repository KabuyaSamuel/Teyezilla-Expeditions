"use client";

import { useState } from "react";
import type { Customer } from "@/lib/admin/data/customers";
import { createCustomer, updateCustomer, deleteCustomer } from "@/lib/admin/actions/customers";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function CustomerForm({ existingCustomer }: { existingCustomer?: Customer }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const input = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      nationality: String(formData.get("nationality") ?? ""),
      emergencyContact: String(formData.get("emergencyContact") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    try {
      if (existingCustomer) {
        await updateCustomer(existingCustomer.id, input);
      } else {
        await createCustomer(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to save customer.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingCustomer) return;
    if (!confirm(`Delete "${existingCustomer.fullName}"? This fails if they have any bookings.`)) return;
    setSaving(true);
    try {
      await deleteCustomer(existingCustomer.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to delete customer.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}

      <section className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="text-xs font-medium text-foreground/60">Full Name</label>
          <input id="fullName" name="fullName" required defaultValue={existingCustomer?.fullName} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="email" className="text-xs font-medium text-foreground/60">Email</label>
          <input id="email" name="email" type="email" required defaultValue={existingCustomer?.email} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="phone" className="text-xs font-medium text-foreground/60">Phone</label>
          <input id="phone" name="phone" defaultValue={existingCustomer?.phone} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="nationality" className="text-xs font-medium text-foreground/60">Nationality</label>
          <input id="nationality" name="nationality" defaultValue={existingCustomer?.nationality} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="emergencyContact" className="text-xs font-medium text-foreground/60">Emergency Contact</label>
          <input id="emergencyContact" name="emergencyContact" defaultValue={existingCustomer?.emergencyContact} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="text-xs font-medium text-foreground/60">Notes</label>
          <textarea id="notes" name="notes" rows={3} defaultValue={existingCustomer?.notes} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <div className="flex justify-end gap-3">
        {existingCustomer && (
          <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
            Delete
          </button>
        )}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving…" : "Save Customer"}
        </button>
      </div>
    </form>
  );
}
