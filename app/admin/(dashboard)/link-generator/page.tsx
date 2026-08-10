import PageHeader from "@/components/admin/PageHeader";
import LinkGenerator from "@/components/admin/LinkGenerator";
import { getTrackedLinks } from "@/lib/admin/data/link-generator";

export default async function LinkGeneratorPage() {
  const links = await getTrackedLinks();

  return (
    <div>
      <PageHeader
        title="Link Generator"
        description="Build trackable links for ads, bios, and campaigns. Every click is counted, and enquiries through them are attributed automatically -- see Reports & Analytics."
      />
      <LinkGenerator links={links} />
    </div>
  );
}
