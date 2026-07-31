import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import ResponsiveTable, { MobileCardHeader } from "@/components/admin/ResponsiveTable";
import { getAdminActivities } from "@/lib/admin/data/activities";

export default async function AdminActivitiesPage() {
  const activities = await getAdminActivities();

  return (
    <div>
      <PageHeader
        title="Activities Library"
        description="Reusable named activities (e.g. Maasai Mara Game Drive) that can be attached to any tour or journey."
        action={
          <Link href="/admin/activities/new" className="btn-primary text-sm">
            + Add Activity
          </Link>
        }
      />

      <ResponsiveTable
        rows={activities}
        keyField={(a) => a.id}
        emptyMessage="No activities yet. Add the first one to get started."
        columns={[
          { header: "Name", cell: (a) => a.name, className: "font-medium text-foreground" },
          { header: "Description", cell: (a) => a.description },
          { header: "", cell: (a) => <Link href={`/admin/activities/${a.slug}`} className="text-primary hover:underline">Edit</Link> },
        ]}
        renderMobileCard={(a) => (
          <>
            <MobileCardHeader
              title={a.name}
              action={<Link href={`/admin/activities/${a.slug}`} className="hover:underline">Edit</Link>}
            />
            {a.description && <p className="mt-2 text-sm text-foreground/70">{a.description}</p>}
          </>
        )}
      />
    </div>
  );
}
