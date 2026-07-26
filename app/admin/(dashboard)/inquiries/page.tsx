import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getInquiries } from "@/lib/admin/data/inquiries";
import { inquiryStatusTone } from "@/lib/admin/status-tone";

const SOURCE_LABELS: Record<string, string> = {
  website: "Website",
  whatsapp: "WhatsApp",
  contact_form: "Contact Form",
  ai_trip_planner: "Trip Planner",
};

const SOURCE_FILTERS = [
  { value: "", label: "All" },
  { value: "website", label: "Website" },
  { value: "contact_form", label: "Contact Form" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "ai_trip_planner", label: "Trip Planner" },
];

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const { source } = await searchParams;
  const all = await getInquiries();
  const inquiries = source ? all.filter((i) => i.source === source) : all;

  return (
    <div>
      <PageHeader
        title="Inquiry Management"
        description="The single inbox: website enquiries, WhatsApp, contact form, and trip planner requests."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {SOURCE_FILTERS.map((f) => {
          const active = (source ?? "") === f.value;
          return (
            <Link
              key={f.value}
              href={f.value ? `/admin/inquiries?source=${f.value}` : "/admin/inquiries"}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active ? "bg-primary text-white" : "bg-secondary/15 text-foreground/70 hover:bg-secondary/25"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

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
                {inq.repliedAt && <Badge tone="success">Replied</Badge>}
              </div>
            </div>
            {inq.tourTitle && <p className="mt-2 text-xs text-foreground/50">Re: {inq.tourTitle}</p>}
            <p className="mt-2 line-clamp-2 whitespace-pre-line text-sm text-foreground/80">{inq.message}</p>

            {inq.tripPlanner && (
              <div className="mt-3 grid grid-cols-2 gap-3 rounded-2xl bg-secondary/10 p-3 text-xs text-foreground/70 sm:grid-cols-3 lg:grid-cols-6">
                <div><p className="text-foreground/40">Destination</p><p className="font-medium text-foreground">{inq.tripPlanner.destination || "—"}</p></div>
                <div><p className="text-foreground/40">Budget</p><p className="font-medium text-foreground">{inq.tripPlanner.budgetUsd ? `$${inq.tripPlanner.budgetUsd.toLocaleString()}` : "—"}</p></div>
                <div><p className="text-foreground/40">Days</p><p className="font-medium text-foreground">{inq.tripPlanner.days || "—"}</p></div>
                <div><p className="text-foreground/40">Travelers</p><p className="font-medium text-foreground">{inq.tripPlanner.travelers || "—"}</p></div>
                <div><p className="text-foreground/40">Style</p><p className="font-medium text-foreground">{inq.tripPlanner.travelStyle || "—"}</p></div>
                <div><p className="text-foreground/40">Luxury Level</p><p className="font-medium text-foreground">{inq.tripPlanner.luxuryLevel || "—"}</p></div>
              </div>
            )}

            <Link href={`/admin/inquiries/${inq.id}`} className="mt-3 inline-block text-xs font-medium text-primary hover:underline">
              Open →
            </Link>
          </div>
        ))}
        {inquiries.length === 0 && <p className="text-sm text-foreground/50">No inquiries{source ? " from this source" : ""}.</p>}
      </div>
    </div>
  );
}
