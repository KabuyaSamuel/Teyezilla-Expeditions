import PageHeader from "@/components/admin/PageHeader";
import LinkGenerator from "@/components/admin/LinkGenerator";

export default function LinkGeneratorPage() {
  return (
    <div>
      <PageHeader
        title="Link Generator"
        description="Build trackable links for ads, bios, and campaigns. Visits through these are attributed automatically -- see the Traffic Sources breakdown on Reports & Analytics."
      />
      <LinkGenerator />
    </div>
  );
}
