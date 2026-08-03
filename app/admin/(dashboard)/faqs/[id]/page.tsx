import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import FaqForm from "@/components/admin/FaqForm";
import { getAdminFaqById } from "@/lib/admin/data/faqs";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faq = await getAdminFaqById(id);
  if (!faq) notFound();

  return (
    <div>
      <PageHeader title="Edit FAQ" description="Update this question and answer." />
      <FaqForm existingFaq={faq} />
    </div>
  );
}
