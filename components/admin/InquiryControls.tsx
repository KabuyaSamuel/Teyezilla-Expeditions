"use client";

import type { StaffMember } from "@/lib/admin/data/staff";
import { updateInquiryStatus, assignInquiry } from "@/lib/admin/actions/inquiries";

const STATUSES = ["new", "in_progress", "quoted", "converted", "closed"] as const;

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
  return (
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
  );
}
