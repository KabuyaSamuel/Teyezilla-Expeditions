import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import AffiliateForm from "@/components/admin/AffiliateForm";
import { getAffiliatePartnerById } from "@/lib/admin/data/affiliates";

export default async function EditAffiliatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await getAffiliatePartnerById(id);
  if (!partner) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${partner.name}`} description="Update this affiliate partner." />
      <AffiliateForm existingPartner={partner} />
    </div>
  );
}
