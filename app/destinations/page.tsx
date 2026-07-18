import type { Metadata } from "next";
import DestinationCard from "@/components/DestinationCard";
import { getDestinations } from "@/lib/destinations";

export const metadata: Metadata = {
  title: "African Destinations: Kenya, Tanzania, Zanzibar, Egypt, Morocco & More",
  description:
    "Explore Teyezilla Expeditions' African destinations, from Kenya's Maasai Mara to Morocco's Sahara desert.",
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="section">
      <h1 className="font-heading text-4xl font-bold text-foreground">Destinations</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Five destinations open for booking today, with more of Africa on the way.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </div>
  );
}
