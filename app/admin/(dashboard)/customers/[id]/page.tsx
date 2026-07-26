import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getCustomerById } from "@/lib/admin/data/customers";
import { getBookings } from "@/lib/admin/data/bookings";
import { bookingStatusTone } from "@/lib/admin/status-tone";

export default async function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [customer, bookings] = await Promise.all([
    getCustomerById(id),
    getBookings(),
  ]);
  if (!customer) notFound();
  const customerBookings = bookings.filter((b) => b.customerId === id);

  return (
    <div>
      <PageHeader
        title={customer.fullName}
        description={customer.email}
        action={
          <Link href={`/admin/customers/${customer.id}/edit`} className="btn-primary text-sm">
            Edit
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Booking History</h2>
          <div className="mt-4 space-y-3">
            {customerBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl bg-secondary/10 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{b.productTitle}</p>
                  <p className="text-xs text-foreground/60">{b.bookingReference} · {b.travelDate ?? "Flexible"}</p>
                </div>
                <Badge tone={bookingStatusTone(b.bookingStatus)}>{b.bookingStatus}</Badge>
              </div>
            ))}
            {customerBookings.length === 0 && (
              <p className="text-sm text-foreground/50">No bookings yet.</p>
            )}
          </div>

          <h2 className="mt-8 font-heading text-lg font-semibold text-foreground">Notes</h2>
          <p className="mt-2 rounded-xl bg-secondary/10 p-4 text-sm text-foreground/70">
            {customer.notes || "No notes on file."}
          </p>
        </div>

        <div className="card h-fit p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="text-foreground/50">Phone</dt><dd className="font-medium text-foreground">{customer.phone}</dd></div>
            <div><dt className="text-foreground/50">Nationality</dt><dd className="font-medium text-foreground">{customer.nationality}</dd></div>
            <div><dt className="text-foreground/50">Emergency Contact</dt><dd className="font-medium text-foreground">{customer.emergencyContact}</dd></div>
            <div><dt className="text-foreground/50">Loyalty Points</dt><dd className="font-medium text-accent">{customer.loyaltyPoints}</dd></div>
            <div><dt className="text-foreground/50">Customer Since</dt><dd className="font-medium text-foreground">{customer.createdAt}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}
