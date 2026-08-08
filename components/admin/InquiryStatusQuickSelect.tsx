"use client";

import { updateInquiryStatus } from "@/lib/admin/actions/inquiries";
import { useToast } from "./Toast";

const STATUSES = ["new", "in_progress", "quoted", "converted", "closed"] as const;

// Lets staff categorize a lead straight from the inbox list as it comes
// in, without opening its detail page -- the full status + assignment
// controls still live there (InquiryControls) for anyone who wants both.
export default function InquiryStatusQuickSelect({ id, status }: { id: string; status: string }) {
  const { toast } = useToast();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const result = await updateInquiryStatus(id, new FormData(e.currentTarget.form!));
    if (result.error) toast.error(result.error);
    else toast.success("Status updated.");
  }

  return (
    <form onClick={(e) => e.stopPropagation()}>
      <select
        name="status"
        defaultValue={status}
        onChange={handleChange}
        className="rounded-full border border-secondary/40 px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s.replace("_", " ")}</option>
        ))}
      </select>
    </form>
  );
}
