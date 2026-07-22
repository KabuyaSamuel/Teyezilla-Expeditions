import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getInquiries } from "@/lib/admin/data/inquiries";
import { inquiryStatusTone } from "@/lib/admin/status-tone";

const SOURCE_LABELS: Record<string, string> = {
  website: "Website",
  whatsapp: "WhatsApp",
  contact_form: "Contact Form",
  ai_trip_planner: "AI Trip Planner",
};

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div>
      <PageHeader
        title="Inquiry Management"
        description="Website, WhatsApp, contact form, and AI Trip Planner inquiries."
      />
      <div className="space-y-4">
        {inquiries.map((inq) => (
          <Link
            key={inq.id}
            href={`/admin/inquiries/${inq.id}`}
            className="card block p-5 transition-shadow hover:shadow-cardHover"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading font-semibold text-foreground">{inq.customerName}</p>
                <p className="text-xs text-foreground/50">{inq.customerEmail} · {inq.createdAt}</p>
              </div>
              <div className="flex gap-2">
                <Badge tone="info">{SOURCE_LABELS[inq.source]}</Badge>
                <Badge tone={inquiryStatusTone(inq.status)}>{inq.status.replace("_", " ")}</Badge>
                {inq.repliedAt && <Badge tone="success">Replied</Badge>}
              </div>
            </div>
            {inq.tourTitle && <p className="mt-2 text-xs text-foreground/50">Re: {inq.tourTitle}</p>}
            <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{inq.message}</p>
            <span className="mt-3 inline-block text-xs font-medium text-primary">Open →</span>
          </Link>
        ))}
        {inquiries.length === 0 && <p className="text-sm text-foreground/50">No inquiries.</p>}
      </div>
    </div>
  );
}
