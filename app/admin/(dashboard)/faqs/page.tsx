import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import { getAdminFaqs } from "@/lib/admin/data/faqs";
import { contentStatusTone } from "@/lib/admin/status-tone";

export default async function AdminFaqsPage() {
  const faqs = await getAdminFaqs();

  return (
    <div>
      <PageHeader
        title="FAQs"
        description="Questions and answers shown on the FAQs page and the Safari guide."
        action={
          <Link href="/admin/faqs/new" className="btn-primary text-sm">
            + Add FAQ
          </Link>
        }
      />

      <ResponsiveTable
        rows={faqs}
        keyField={(f) => f.id}
        emptyMessage="No FAQs yet. Add the first one to get started."
        columns={[
          { header: "Question", cell: (f) => f.question, className: "font-medium text-foreground" },
          { header: "Category", cell: (f) => f.category },
          { header: "Status", cell: (f) => <Badge tone={contentStatusTone(f.status)}>{f.status}</Badge> },
          { header: "", cell: (f) => <Link href={`/admin/faqs/${f.id}`} className="text-primary hover:underline">Edit</Link> },
        ]}
        renderMobileCard={(f) => (
          <>
            <MobileCardHeader
              title={f.question}
              subtitle={f.category}
              action={<Link href={`/admin/faqs/${f.id}`} className="hover:underline">Edit</Link>}
            />
            <div className="mt-3 space-y-1 border-t border-secondary/10 pt-3">
              <MobileCardField label="Status" value={<Badge tone={contentStatusTone(f.status)}>{f.status}</Badge>} />
            </div>
          </>
        )}
      />
    </div>
  );
}
