import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getTours } from "@/lib/tours";
import { getDestinations } from "@/lib/destinations";
import { contentStatusTone } from "@/lib/admin/status-tone";

export default async function AdminToursPage() {
  const [tours, destinations] = await Promise.all([getTours(), getDestinations()]);
  return (
    <div>
      <PageHeader
        title="Tour Management"
        description="Create and manage every tour package across all destinations."
        action={
          <Link href="/admin/tours/new" className="btn-primary text-sm">
            + Add Tour
          </Link>
        }
      />

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-5 py-3">Tour</th>
              <th className="px-5 py-3">Destination</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Duration</th>
              <th className="px-5 py-3">Price From</th>
              <th className="px-5 py-3">Featured</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => {
              const destination = destinations.find((d) => d.id === tour.destinationId);
              return (
                <tr key={tour.id} className="border-b border-secondary/10 last:border-0">
                  <td className="px-5 py-3 font-medium text-foreground">{tour.title}</td>
                  <td className="px-5 py-3 text-foreground/70">{destination?.countryName ?? "—"}</td>
                  <td className="px-5 py-3 text-foreground/70">{tour.categoryLabel}</td>
                  <td className="px-5 py-3 text-foreground/70">{tour.durationDays}d</td>
                  <td className="px-5 py-3 text-foreground/70">{tour.currency} {tour.priceFrom}</td>
                  <td className="px-5 py-3">{tour.featured ? "★" : "—"}</td>
                  <td className="px-5 py-3">
                    <Badge tone={contentStatusTone(tour.status)}>{tour.status}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/admin/tours/${tour.slug}`} className="text-primary hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
