import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import Badge from "@/components/admin/Badge";
import Link from "next/link";
import { getBookings } from "@/lib/admin/data/bookings";
import { getInquiries } from "@/lib/admin/data/inquiries";
import { bookingStatusTone } from "@/lib/admin/status-tone";
import { getFeaturedDestinations } from "@/lib/destinations";
import { getFeaturedTours } from "@/lib/tours";
import { getFeaturedJourneys } from "@/lib/journeys";
import { FEATURED_DESTINATIONS_COUNT, FEATURED_EXPERIENCES_COUNT, FEATURED_JOURNEYS_COUNT } from "@/lib/featuredCounts";

export default async function AdminDashboardPage() {
  const [bookings, inquiries, featuredDestinations, featuredTours, featuredJourneys] = await Promise.all([
    getBookings(),
    getInquiries(),
    getFeaturedDestinations(),
    getFeaturedTours(),
    getFeaturedJourneys(),
  ]);

  // Purely informational -- the homepage always fills any gap from the full
  // catalogue (see lib/featuredCounts.ts), so this is a nudge to curate a
  // better set, never a blocker.
  const featuredShortfalls = [
    { label: "Destinations", href: "/admin/destinations", count: featuredDestinations.length, target: FEATURED_DESTINATIONS_COUNT },
    { label: "Journeys", href: "/admin/journeys", count: featuredJourneys.length, target: FEATURED_JOURNEYS_COUNT },
    { label: "Experiences", href: "/admin/tours", count: featuredTours.length, target: FEATURED_EXPERIENCES_COUNT },
  ].filter((s) => s.count < s.target);
  const totalBookings = bookings.length;
  // Revenue is staff-entered: bookings marked paid, using the quoted total.
  const revenueTotal = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);
  // Every booking enquiry is mirrored into `inquiries` (app/booking/actions.ts)
  // so it also shows up in the single-inbox Inquiry Management view. Exclude
  // booking-derived inquiries here so each lead is counted exactly once
  // instead of once per table.
  const newEnquiries =
    bookings.filter((b) => b.bookingStatus === "inquiry").length +
    inquiries.filter((i) => i.status === "new" && !i.bookingId).length;

  const now = new Date();
  const upcomingTours = bookings
    .filter((b) => b.travelDate && new Date(b.travelDate) >= now && b.bookingStatus !== "cancelled")
    .sort((a, b) => new Date(a.travelDate!).getTime() - new Date(b.travelDate!).getTime());

  const recentInquiries = [...inquiries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Uses the same primary-destination attribution as Reports (see
  // lib/admin/data/bookings.ts) so tour AND journey bookings both count,
  // rather than matching tour slugs against destination slugs by substring.
  const destinationCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    const key = b.destinationName || "Other";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const popularDestinations = Object.entries(destinationCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of bookings, revenue, and activity across Teyezilla Expeditions."
      />

      {featuredShortfalls.length > 0 && (
        <div className="mb-6 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm">
          <p className="font-medium text-foreground">Homepage featured sections could use more picks</p>
          <p className="mt-1 text-xs text-foreground/60">
            Optional -- the homepage automatically fills any gap with other published items, so nothing looks broken either way.
          </p>
          <ul className="mt-2 space-y-1">
            {featuredShortfalls.map((s) => (
              <li key={s.label} className="text-foreground/80">
                <Link href={s.href} className="font-medium text-primary hover:underline">{s.label}</Link>: {s.count} of {s.target} marked featured
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="New Enquiries"
          value={String(newEnquiries)}
          accent
          sublabel="awaiting first response"
          href="/admin/inquiries"
        />
        <StatCard label="Total Bookings" value={String(totalBookings)} sublabel="all time" href="/admin/bookings" />
        <StatCard
          label="Revenue (recorded)"
          value={`$${revenueTotal.toLocaleString()}`}
          sublabel="bookings marked paid"
          href="/admin/reports"
        />
        <StatCard
          label="Upcoming Tours"
          value={String(upcomingTours.length)}
          sublabel="with a set travel date"
          href="/admin/bookings"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Link
          href="/admin/bookings"
          className="card block border border-transparent p-6 transition-colors hover:border-primary/30 lg:col-span-2"
        >
          <h2 className="font-heading text-lg font-semibold text-foreground">Booking Calendar</h2>
          <p className="mt-1 text-xs text-foreground/50">Upcoming departures, soonest first</p>
          <div className="mt-4 space-y-3">
            {upcomingTours.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl bg-secondary/10 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{b.productTitle}</p>
                  <p className="text-xs text-foreground/60">{b.bookingReference} · {b.customerName} · {b.travelerCount} traveler(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{b.travelDate}</p>
                  <Badge tone={bookingStatusTone(b.bookingStatus)}>{b.bookingStatus}</Badge>
                </div>
              </div>
            ))}
          </div>
          <span className="mt-4 inline-block text-sm font-medium text-primary">View all bookings →</span>
        </Link>

        <Link
          href="/admin/bookings"
          className="card block border border-transparent p-6 transition-colors hover:border-primary/30"
        >
          <h2 className="font-heading text-lg font-semibold text-foreground">Popular Destinations</h2>
          <div className="mt-4 space-y-3">
            {popularDestinations.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <span className="text-foreground/80">{name}</span>
                <span className="font-semibold text-primary">{count} booking(s)</span>
              </div>
            ))}
          </div>
          <span className="mt-4 inline-block text-sm font-medium text-primary">View all bookings →</span>
        </Link>
      </div>

      <Link
        href="/admin/inquiries"
        className="mt-6 card block border border-transparent p-6 transition-colors hover:border-primary/30"
      >
        <h2 className="font-heading text-lg font-semibold text-foreground">Recent Inquiries</h2>
        <div className="mt-4 space-y-3">
          {recentInquiries.map((inq) => (
            <div key={inq.id} className="flex items-center justify-between rounded-xl bg-secondary/10 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{inq.customerName}</p>
                <p className="text-xs text-foreground/60">{inq.message}</p>
              </div>
              <Badge tone="info">{inq.source.replace("_", " ")}</Badge>
            </div>
          ))}
        </div>
        <span className="mt-4 inline-block text-sm font-medium text-primary">View all inquiries →</span>
      </Link>

      <div className="mt-6 rounded-xl bg-secondary/10 p-4 text-xs text-foreground/60">
        Visitor stats require Google Analytics 4 (wired up in a later phase). Bookings,
        revenue, and inquiries above reflect live Supabase data; revenue is the total of
        bookings staff have marked as paid.
      </div>
    </div>
  );
}
