"use client";

import { useState } from "react";
import type { Customer } from "@/lib/admin/data/customers";
import { createCustomer, updateCustomer, archiveCustomer, unarchiveCustomer } from "@/lib/admin/actions/customers";
import { useToast } from "./Toast";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function CustomerForm({ existingCustomer }: { existingCustomer?: Customer }) {
  const { toast } = useToast();
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
      const message = err instanceof Error ? err.message : "Failed to save customer.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  async function handleArchive() {
    if (!existingCustomer) return;
    if (!confirm(`Archive "${existingCustomer.fullName}"? They'll drop off the active customer list, but their bookings, payments, and loyalty history are kept. You can unarchive them later.`)) return;
    setSaving(true);
    try {
      await archiveCustomer(existingCustomer.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to archive customer.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  async function handleUnarchive() {
    if (!existingCustomer) return;
    setSaving(true);
    try {
      await unarchiveCustomer(existingCustomer.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to unarchive customer.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}
      {existingCustomer?.archivedAt && (
        <div className="rounded-xl bg-secondary/10 px-4 py-3 text-sm text-foreground/70">
          Archived on {new Date(existingCustomer.archivedAt).toLocaleDateString()}. Hidden from the active customer list.
        </div>
      )}
      <p className="text-xs text-foreground/50">Fields marked with <span className="text-error">*</span> are required.</p>

      <section className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="text-xs font-medium text-foreground/60">Full Name <span className="text-error">*</span></label>
          <input id="fullName" name="fullName" required defaultValue={existingCustomer?.fullName} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="email" className="text-xs font-medium text-foreground/60">Email <span className="text-error">*</span></label>
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

      <div className="flex flex-wrap justify-end gap-3">
        {existingCustomer && (existingCustomer.archivedAt ? (
          <button type="button" onClick={handleUnarchive} disabled={saving} className="rounded-full border-2 border-secondary/40 px-5 py-2 text-sm font-medium text-foreground/70 hover:bg-secondary/10 transition-colors disabled:opacity-50">
            Unarchive
          </button>
        ) : (
          <button type="button" onClick={handleArchive} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
            Archive
          </button>
        ))}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving…" : "Save Customer"}
        </button>
      </div>
    </form>
  );
}
