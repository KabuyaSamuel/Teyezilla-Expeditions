import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import { getAdminExperienceTypes } from "@/lib/admin/data/experience-types";

export default async function AdminExperienceTypesPage() {
  const experienceTypes = await getAdminExperienceTypes();

  return (
    <div>
      <PageHeader
        title="Experience Types"
        description="Categories used to tag tours and journeys, and to power their own /experiences pages (Wildlife & Safari, Beach & Islands, ...)."
        action={
          <Link href="/admin/experience-types/new" className="btn-primary text-sm">
            + Add Experience Type
          </Link>
        }
      />

      <ResponsiveTable
        rows={experienceTypes}
        keyField={(e) => e.id}
        emptyMessage="No experience types yet. Add the first one to get started."
        columns={[
          { header: "Experience Type", cell: (e) => e.name, className: "font-medium text-foreground" },
          { header: "Tours", cell: (e) => e.tourCount },
          { header: "Journeys", cell: (e) => e.journeyCount },
          { header: "", cell: (e) => <Link href={`/admin/experience-types/${e.slug}`} className="text-primary hover:underline">Edit</Link> },
        ]}
        renderMobileCard={(e) => (
          <>
            <MobileCardHeader
              title={e.name}
              action={<Link href={`/admin/experience-types/${e.slug}`} className="hover:underline">Edit</Link>}
            />
            <div className="mt-3 space-y-1 border-t border-secondary/10 pt-3">
              <MobileCardField label="Tours" value={e.tourCount} />
              <MobileCardField label="Journeys" value={e.journeyCount} />
            </div>
          </>
        )}
      />
    </div>
  );
}
