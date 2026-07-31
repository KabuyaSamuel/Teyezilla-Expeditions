import type { Metadata } from "next";
import TripPlannerForm from "@/components/TripPlannerForm";

export const metadata: Metadata = {
  title: "AI Trip Planner",
  description: "Get a suggested African itinerary from Teyezilla Expeditions' AI trip planner.",
};

export default function TripPlannerPage() {
  return (
    <div className="section max-w-2xl">
      <h1 className="h1-page">AI Trip Planner</h1>
      <p className="mt-3 text-foreground/70">
        Tell us your destination, budget, and travel style, and our travel team will craft a
        suggested itinerary and personal quote and send it to you within 24 hours.
      </p>
      <TripPlannerForm />
    </div>
  );
}
