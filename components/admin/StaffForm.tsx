"use client";

import { useState } from "react";
import Link from "next/link";
import type { StaffMember } from "@/lib/admin/data/staff";
import type { StaffRole } from "@/lib/admin/permissions";
import { ROLE_LABELS } from "@/lib/admin/permissions";
import { createStaffMember, updateStaffMember, deleteStaffMember } from "@/lib/admin/actions/staff";
import { useToast } from "./Toast";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest: unknown }).digest).startsWith("NEXT_REDIRECT");
}

const ROLES = Object.keys(ROLE_LABELS) as StaffRole[];

export default function StaffForm({ existingStaff }: { existingStaff?: StaffMember }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const input = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      role: String(formData.get("role") ?? "sales_agent") as StaffRole,
    };

    try {
      if (existingStaff) {
        await updateStaffMember(existingStaff.id, { fullName: input.fullName, role: input.role });
      } else {
        const { tempPassword } = await createStaffMember(input);
        setTempPassword(tempPassword);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to save staff member.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingStaff) return;
    if (!confirm(`Remove ${existingStaff.fullName}'s access? This deletes their login.`)) return;
    setSaving(true);
    try {
      await deleteStaffMember(existingStaff.id, existingStaff.authUserId);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to delete staff member.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  if (tempPassword) {
    return (
      <div className="card space-y-4 p-6">
        <div className="rounded-xl bg-success/10 px-4 py-3 text-sm text-success">
          Account created. Share this temporary password with them securely; it won&apos;t be shown again.
          They should change it after logging in.
        </div>
        <p className="rounded-xl bg-secondary/10 p-4 font-mono text-lg">{tempPassword}</p>
        <Link href="/admin/staff" className="btn-primary inline-flex">Done</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}

      <section className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="text-xs font-medium text-foreground/60">Full Name</label>
          <input id="fullName" name="fullName" required defaultValue={existingStaff?.fullName} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="email" className="text-xs font-medium text-foreground/60">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={!!existingStaff}
            defaultValue={existingStaff?.email}
            className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-secondary/10 disabled:text-foreground/50"
          />
          {existingStaff && <p className="mt-1 text-xs text-foreground/40">Email can&apos;t be changed here.</p>}
        </div>
        <div>
          <label htmlFor="role" className="text-xs font-medium text-foreground/60">Role</label>
          <select id="role" name="role" defaultValue={existingStaff?.role ?? "sales_agent"} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            {ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        {existingStaff && (
          <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
            Remove Access
          </button>
        )}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving…" : existingStaff ? "Save Staff Member" : "Create Account"}
        </button>
      </div>
    </form>
  );
}
