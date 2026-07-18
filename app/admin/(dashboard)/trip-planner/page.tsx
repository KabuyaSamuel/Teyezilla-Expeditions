import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { tripPlannerRequests } from "@/lib/admin/data/trip-planner-requests";

export default function AdminTripPlannerPage() {
  return (
    <div>
      <PageHeader
        title="AI Trip Planner"
        description="Submitted itinerary requests — review, edit, quote, or convert to a booking."
      />
      <div className="space-y-4">
        {tripPlannerRequests.map((req) => (
          <div key={req.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading font-semibold text-foreground">{req.customerName}</p>
                <p className="text-xs text-foreground/50">{req.customerEmail} · {req.createdAt}</p>
              </div>
              <Badge tone={req.status === "converted" ? "success" : req.status === "quoted" ? "pending" : "info"}>
                {req.status}
              </Badge>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-foreground/70 sm:grid-cols-5">
              <div><p className="text-foreground/40">Destination</p><p className="font-medium text-foreground">{req.destination}</p></div>
              <div><p className="text-foreground/40">Budget</p><p className="font-medium text-foreground">${req.budgetUsd}</p></div>
              <div><p className="text-foreground/40">Days</p><p className="font-medium text-foreground">{req.days}</p></div>
              <div><p className="text-foreground/40">Travelers</p><p className="font-medium text-foreground">{req.travelers}</p></div>
              <div><p className="text-foreground/40">Style</p><p className="font-medium text-foreground">{req.travelStyle}</p></div>
            </div>

            <div className="mt-3">
              <p className="text-xs font-medium text-foreground/50">AI-Suggested Itinerary</p>
              <textarea
                defaultValue={req.aiSuggestedItinerary}
                rows={3}
                className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button className="btn-outline px-4 py-2 text-xs">Save Edits</button>
              <button className="btn-outline px-4 py-2 text-xs">Send Quotation</button>
              <button className="btn-primary px-4 py-2 text-xs">Convert to Booking</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
