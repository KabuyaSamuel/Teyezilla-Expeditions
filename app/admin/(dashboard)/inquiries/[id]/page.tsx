import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import InquiryControls from "@/components/admin/InquiryControls";
import InquiryReplyForm from "@/components/admin/InquiryReplyForm";
import { getInquiryById } from "@/lib/admin/data/inquiries";
import { getStaffMembers } from "@/lib/admin/data/staff";
import { inquiryStatusTone } from "@/lib/admin/status-tone";

const SOURCE_LABELS: Record<string, string> = {
  website: "Website",
  whatsapp: "WhatsApp",
  contact_form: "Contact Form",
  ai_trip_planner: "AI Trip Planner",
};

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [inquiry, staff] = await Promise.all([getInquiryById(id), getStaffMembers()]);
  if (!inquiry) notFound();

  return (
    <div>
      <PageHeader
        title={inquiry.customerName}
        description={`${inquiry.customerEmail}${inquiry.customerPhone ? ` · ${inquiry.customerPhone}` : ""}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info">{SOURCE_LABELS[inquiry.source]}</Badge>
            <Badge tone={inquiryStatusTone(inquiry.status)}>{inquiry.status.replace("_", " ")}</Badge>
            <span className="text-xs text-foreground/50">{inquiry.createdAt}</span>
          </div>
          {inquiry.tourTitle && <p className="mt-2 text-xs text-foreground/50">Re: {inquiry.tourTitle}</p>}

          <h2 className="mt-6 font-heading text-sm font-semibold uppercase tracking-wide text-foreground/50">
            Message
          </h2>
          <p className="mt-2 rounded-2xl bg-secondary/10 p-4 text-sm text-foreground/80">{inquiry.message}</p>

          <h2 className="mt-8 font-heading text-sm font-semibold uppercase tracking-wide text-foreground/50">
            Reply
          </h2>
          {inquiry.repliedAt && (
            <p className="mt-1 text-xs text-foreground/50">Last replied {new Date(inquiry.repliedAt).toLocaleString()}</p>
          )}
          <div className="mt-2">
            <InquiryReplyForm
              id={inquiry.id}
              status={inquiry.status}
              existingReply={inquiry.staffReply}
              customerEmail={inquiry.customerEmail}
              customerPhone={inquiry.customerPhone}
              source={inquiry.source}
            />
          </div>
        </div>

        <div className="card h-fit space-y-4 p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Status & Assignment</h2>
          <InquiryControls
            id={inquiry.id}
            status={inquiry.status}
            assignedStaffId={inquiry.assignedStaffId}
            staff={staff}
          />
        </div>
      </div>
    </div>
  );
}
