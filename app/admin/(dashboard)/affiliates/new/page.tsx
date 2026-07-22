import PageHeader from "@/components/admin/PageHeader";
import AffiliateForm from "@/components/admin/AffiliateForm";

export default function NewAffiliatePage() {
  return (
    <div>
      <PageHeader title="Add Affiliate Partner" description="Add a new affiliate or OTA partner." />
      <AffiliateForm />
    </div>
  );
}
