import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
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

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-b border-secondary/10 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{activity.name}</td>
                <td className="px-5 py-3 text-foreground/70">{activity.description}</td>
                <td className="px-5 py-3">
                  <Link href={`/admin/activities/${activity.slug}`} className="text-primary hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {activities.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-6 text-center text-sm text-foreground/50">
                  No activities yet. Add the first one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
