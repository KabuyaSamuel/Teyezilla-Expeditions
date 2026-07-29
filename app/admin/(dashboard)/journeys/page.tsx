import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getAdminJourneys } from "@/lib/admin/data/journeys";
import { contentStatusTone } from "@/lib/admin/status-tone";

export default async function AdminJourneysPage() {
  const journeys = await getAdminJourneys();

  return (
    <div>
      <PageHeader
        title="Journey Management"
        description="Multi-country and signature journeys, distinct from single-destination tours."
        action={
          <Link href="/admin/journeys/new" className="btn-primary text-sm">
            + Add Journey
          </Link>
        }
      />

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-5 py-3">Journey</th>
              <th className="px-5 py-3">Primary Destination</th>
              <th className="px-5 py-3">Duration</th>
              <th className="px-5 py-3">Price From</th>
              <th className="px-5 py-3">Featured</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {journeys.map((journey) => (
              <tr key={journey.id} className="border-b border-secondary/10 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{journey.title}</td>
                <td className="px-5 py-3 text-foreground/70">{journey.primaryDestinationName}</td>
                <td className="px-5 py-3 text-foreground/70">{journey.durationDays}d</td>
                <td className="px-5 py-3 text-foreground/70">{journey.currency} {journey.priceFrom}</td>
                <td className="px-5 py-3">{journey.featured ? "★" : "-"}</td>
                <td className="px-5 py-3">
                  <Badge tone={contentStatusTone(journey.status)}>{journey.status}</Badge>
                </td>
                <td className="px-5 py-3">
                  <Link href={`/admin/journeys/${journey.slug}`} className="text-primary hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {journeys.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-6 text-center text-sm text-foreground/50">
                  No journeys yet. Add the first one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
