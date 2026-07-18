import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Trip Planner",
  description: "Get a suggested African itinerary from Teyezilla Expeditions' AI trip planner.",
};

export default function TripPlannerPage() {
  return (
    <div className="section max-w-2xl">
      <h1 className="font-heading text-4xl font-bold text-foreground">AI Trip Planner</h1>
      <p className="mt-3 text-foreground/70">
        Tell us your destination, budget, and travel style — we'll suggest an itinerary
        you can send to WhatsApp or submit as an inquiry. The AI generation logic connects
        in a later build step; this captures the inputs.
      </p>
      <form className="mt-8 space-y-4">
        <select className="w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option>Kenya</option>
          <option>Tanzania</option>
          <option>Zanzibar</option>
          <option>Egypt</option>
          <option>Morocco</option>
        </select>
        <input type="number" placeholder="Budget (USD)" className="w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <input type="number" placeholder="Number of days" className="w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <input type="number" placeholder="Number of travelers" className="w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <select className="w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option>Relaxed</option>
          <option>Adventure</option>
          <option>Culture-focused</option>
          <option>Luxury</option>
        </select>
        <button type="submit" className="btn-primary">Generate My Itinerary</button>
      </form>
    </div>
  );
}
