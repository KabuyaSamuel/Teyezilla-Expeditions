import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import TravelResourcesForm from "@/components/admin/TravelResourcesForm";
import { getDestinations } from "@/lib/destinations";

export default async function AdminTravelResourcesPage() {
  const destinations = await getDestinations();
  const launchDestinations = destinations.filter((d) => d.isLaunchDestination);

  return (
    <div>
      <PageHeader
        title="Travel Resources"
        description="Visa requirements, packing lists, insurance, and health guidance per destination. Only destinations marked Live show up here -- add a country in Destination Management first."
        action={
          <Link href="/admin/destinations/new" className="btn-primary text-sm">
            + Add Country
          </Link>
        }
      />
      <div className="space-y-4">
        {launchDestinations.map((d) => (
          <div key={d.id} className="card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {d.flagEmoji} {d.countryName}
            </h2>
            <div className="mt-4">
              <TravelResourcesForm
                destinationId={d.id}
                initial={{
                  visaInfo: d.visaInfo,
                  healthGuidance: d.healthGuidance,
                  packingList: d.packingList,
                  insuranceInfo: d.insuranceInfo,
                }}
              />
            </div>
          </div>
        ))}
        {launchDestinations.length === 0 && (
          <p className="text-sm text-foreground/50">
            No live destinations yet. Add one and mark it &ldquo;Live (open for booking)&rdquo; to manage its travel resources here.
          </p>
        )}
      </div>
    </div>
  );
}
