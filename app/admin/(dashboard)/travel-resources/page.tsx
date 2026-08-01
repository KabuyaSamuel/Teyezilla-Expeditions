import PageHeader from "@/components/admin/PageHeader";
import TravelResourcesForm from "@/components/admin/TravelResourcesForm";
import { getDestinations } from "@/lib/destinations";

export default async function AdminTravelResourcesPage() {
  const destinations = await getDestinations();
  return (
    <div>
      <PageHeader
        title="Travel Resources"
        description="Visa requirements, packing lists, insurance, and health guidance per destination."
      />
      <div className="space-y-4">
        {destinations.filter((d) => d.isLaunchDestination).map((d) => (
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
      </div>
    </div>
  );
}
