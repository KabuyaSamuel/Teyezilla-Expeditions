import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getDestinations } from "@/lib/destinations";

export default async function AdminDestinationsPage() {
  const destinations = await getDestinations();
  return (
    <div>
      <PageHeader
        title="Destination Management"
        description="Countries, attractions, hotels, and travel guidance for each destination."
        action={
          <Link href="/admin/destinations/new" className="btn-primary text-sm">
            + Add Destination
          </Link>
        }
      />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-5 py-3">Destination</th>
              <th className="px-5 py-3">Best Time to Visit</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((d) => (
              <tr key={d.id} className="border-b border-secondary/10 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{d.flagEmoji} {d.countryName}</td>
                <td className="px-5 py-3 text-foreground/70">{d.bestTimeToVisit}</td>
                <td className="px-5 py-3">
                  <Badge tone={d.isLaunchDestination ? "success" : "pending"}>
                    {d.isLaunchDestination ? "Live" : "Coming Soon"}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <Link href={`/admin/destinations/${d.slug}`} className="text-primary hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
