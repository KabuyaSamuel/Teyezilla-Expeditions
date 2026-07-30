import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import { getBookings } from "@/lib/admin/data/bookings";

export default async function AdminReportsPage() {
  const bookings = await getBookings();

  // Revenue is staff-entered: bookings marked paid, using the quoted total.
  // Product-agnostic by construction (no filter on tourSlug/productType), so
  // journey-linked bookings were always included in this total.
  const revenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((s, b) => s + b.totalAmount, 0);

  // Also product-agnostic: counts every booking regardless of whether it's
  // linked to a tour or a journey.
  const conversion = bookings.length
    ? Math.round(
        (bookings.filter((b) => ["confirmed", "completed"].includes(b.bookingStatus)).length /
          bookings.length) *
          100
      )
    : 0;

  const revenueByProductType = {
    tour: bookings.filter((b) => b.productType === "tour" && b.paymentStatus === "paid").reduce((s, b) => s + b.totalAmount, 0),
    journey: bookings.filter((b) => b.productType === "journey" && b.paymentStatus === "paid").reduce((s, b) => s + b.totalAmount, 0),
  };
  const maxProductRevenue = Math.max(revenueByProductType.tour, revenueByProductType.journey, 1);

  // Grouped using Booking.destinationName (lib/admin/data/bookings.ts), which
  // attributes tour bookings to their own destination and journey bookings to
  // their primary (first) leg -- see the comment there for why that
  // attribution rule was chosen over splitting evenly or duplicating across
  // every leg. This is what used to only match tour bookings by slug, silently
  // dropping every journey booking from the chart below.
  const salesByDestinationMap = bookings
    .filter((b) => b.paymentStatus === "paid" && b.destinationName)
    .reduce<Record<string, number>>((acc, b) => {
      acc[b.destinationName] = (acc[b.destinationName] ?? 0) + b.totalAmount;
      return acc;
    }, {});
  const salesByDestination = Object.entries(salesByDestinationMap)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
  const maxRevenue = Math.max(...salesByDestination.map((d) => d.revenue), 1);

  // Most-enquired product: real data available today (count of bookings per
  // product), unlike "most viewed" which needs GA4 page-view tracking.
  const enquiryCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    if (!b.productTitle) return acc;
    acc[b.productTitle] = (acc[b.productTitle] ?? 0) + 1;
    return acc;
  }, {});
  const mostEnquired = Object.entries(enquiryCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div>
      <PageHeader title="Reports & Analytics" description="Revenue, bookings, and conversion across the platform." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Revenue" value={`$${revenue.toLocaleString()}`} accent sublabel="bookings marked paid, tours + journeys" />
        <StatCard label="Conversion Rate" value={`${conversion}%`} sublabel="enquiries confirmed or completed" />
        <StatCard
          label="Most Enquired Product"
          value={mostEnquired ? mostEnquired[0] : "No enquiries yet"}
          sublabel={mostEnquired ? `${mostEnquired[1]} enquir${mostEnquired[1] === 1 ? "y" : "ies"}` : undefined}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Tours vs Journeys Revenue</h2>
          <p className="mt-1 text-xs text-foreground/50">Bookings marked paid, split by product type</p>
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/80">Tours</span>
                <span className="font-medium text-foreground">${revenueByProductType.tour.toLocaleString()}</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-secondary/20">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${(revenueByProductType.tour / maxProductRevenue) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/80">Journeys</span>
                <span className="font-medium text-foreground">${revenueByProductType.journey.toLocaleString()}</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-secondary/20">
                <div className="h-2 rounded-full bg-accent" style={{ width: `${(revenueByProductType.journey / maxProductRevenue) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Sales by Destination</h2>
          <div className="mt-4 space-y-3">
            {salesByDestination.map((d) => (
              <div key={d.name}>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/80">{d.name}</span>
                  <span className="font-medium text-foreground">${d.revenue.toLocaleString()}</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-secondary/20">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(d.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {salesByDestination.length === 0 && (
              <p className="text-sm text-foreground/50">No paid bookings yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-secondary/10 p-4 text-xs text-foreground/60">
        Visitor stats (page views, most-viewed product) require Google Analytics 4, wired
        up in a later phase. Every figure above is computed from live Supabase booking data.
      </div>
    </div>
  );
}
