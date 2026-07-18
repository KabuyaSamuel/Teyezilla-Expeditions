import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { inquiries } from "@/lib/admin/data/inquiries";
import { inquiryStatusTone } from "@/lib/admin/status-tone";

const SOURCE_LABELS: Record<string, string> = {
  website: "Website",
  whatsapp: "WhatsApp",
  contact_form: "Contact Form",
  ai_trip_planner: "AI Trip Planner",
};

export default function AdminInquiriesPage() {
  return (
    <div>
      <PageHeader
        title="Inquiry Management"
        description="Website, WhatsApp, contact form, and AI Trip Planner inquiries."
      />
      <div className="space-y-4">
        {inquiries.map((inq) => (
          <div key={inq.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading font-semibold text-foreground">{inq.customerName}</p>
                <p className="text-xs text-foreground/50">{inq.customerEmail} · {inq.createdAt}</p>
              </div>
              <div className="flex gap-2">
                <Badge tone="info">{SOURCE_LABELS[inq.source]}</Badge>
                <Badge tone={inquiryStatusTone(inq.status)}>{inq.status.replace("_", " ")}</Badge>
              </div>
            </div>
            {inq.tourTitle && <p className="mt-2 text-xs text-foreground/50">Re: {inq.tourTitle}</p>}
            <p className="mt-2 text-sm text-foreground/80">{inq.message}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <select defaultValue={inq.assignedStaff ?? ""} className="rounded-full border border-secondary/40 px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Assign to staff...</option>
                <option>Grace Mwangi</option>
                <option>James Otieno</option>
                <option>Amina Wanjiru</option>
              </select>
              <button className="btn-outline px-4 py-2 text-xs">Set Follow-up Reminder</button>
              <button className="btn-primary px-4 py-2 text-xs">Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
