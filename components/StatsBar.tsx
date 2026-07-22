import { MapPin, Briefcase, Users, Star } from "lucide-react";
import { getDestinations } from "@/lib/destinations";
import { getTours } from "@/lib/tours";

// The Google rating isn't derived from a real aggregated review source yet
// (no Google Business Profile sync) — still a placeholder. Happy Travelers
// is admin-editable now (Website Settings), passed in as a prop.
const GOOGLE_RATING_PLACEHOLDER = "5.0";

export default async function StatsBar({ happyTravelersCount }: { happyTravelersCount: string }) {
  const [destinations, tours] = await Promise.all([getDestinations(), getTours()]);

  const stats = [
    { icon: MapPin, value: `${destinations.length}+`, label: "Destinations" },
    { icon: Briefcase, value: `${tours.length}+`, label: "Tours & Experiences" },
    { icon: Users, value: `${happyTravelersCount}+`, label: "Happy Travelers" },
    { icon: Star, value: GOOGLE_RATING_PLACEHOLDER, label: "Rated on Google" },
  ];

  return (
    <div className="bg-primary text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="h-8 w-8 shrink-0 text-accent" />
            <div>
              <p className="font-heading text-2xl font-bold">{value}</p>
              <p className="text-sm text-white/70">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
