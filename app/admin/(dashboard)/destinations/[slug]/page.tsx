import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { getDestinationBySlug } from "@/lib/destinations";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${destination.countryName}`} description="Update destination content and travel guidance." />
      <form className="space-y-6">
        <section className="card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Overview</h2>
          <textarea id="overview" name="overview" defaultValue={destination.overview} rows={4} className="mt-3 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </section>
        <section className="card grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <label htmlFor="bestTimeToVisit" className="text-xs font-medium text-foreground/60">Best Time to Visit</label>
            <input id="bestTimeToVisit" name="bestTimeToVisit" defaultValue={destination.bestTimeToVisit} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="visaInfo" className="text-xs font-medium text-foreground/60">Visa Information</label>
            <input id="visaInfo" name="visaInfo" defaultValue={destination.visaInfo} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </section>
        <section className="card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Attractions, Hotels & Restaurants</h2>
          <p className="mt-1 text-xs text-foreground/50">
            Manage as tagged Media Library entries and linked tour packages until a
            dedicated sub-schema for attractions/hotels/restaurants is added.
          </p>
        </section>
        <button type="submit" className="btn-primary">Save Destination</button>
      </form>
    </div>
  );
}
