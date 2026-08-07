"use client";

import { useState } from "react";
import type { StaffMember } from "@/lib/admin/data/staff";
import { updateInquiryStatus, assignInquiry, deleteInquiry } from "@/lib/admin/actions/inquiries";

const STATUSES = ["new", "in_progress", "quoted", "converted", "closed"] as const;

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function InquiryControls({
  id,
  status,
  assignedStaffId,
  staff,
}: {
  id: string;
  status: string;
  assignedStaffId?: string;
  staff: StaffMember[];
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm("Delete this contact/inquiry? This can't be undone.")) return;
    setDeleting(true);
    try {
      await deleteInquiry(id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to delete inquiry.");
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <form action={assignInquiry.bind(null, id)} className="contents">
          <select
            name="staffId"
            defaultValue={assignedStaffId ?? ""}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className="rounded-full border border-secondary/40 px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Assign to staff...</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>{s.fullName}</option>
            ))}
          </select>
        </form>
        <form action={updateInquiryStatus.bind(null, id)} className="contents">
          <select
            name="status"
            defaultValue={status}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className="rounded-full border border-secondary/40 px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </select>
        </form>
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-full border-2 border-error px-4 py-2 text-xs font-medium text-error transition-colors hover:bg-error hover:text-white disabled:opacity-50"
      >
        {deleting ? "Deleting…" : "Delete Inquiry"}
      </button>
    </div>
  );
}
