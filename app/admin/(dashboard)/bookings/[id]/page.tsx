import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getBookingById } from "@/lib/admin/data/bookings";
import { getCustomerById } from "@/lib/admin/data/customers";
import { payments } from "@/lib/admin/data/payments";
import { bookingStatusTone, paymentStatusTone } from "@/lib/admin/status-tone";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = getBookingById(id);
  if (!booking) notFound();

  const customer = getCustomerById(booking.customerId);
  const relatedPayments = payments.filter((p) => p.bookingReference === booking.bookingReference);

  return (
    <div>
      <PageHeader
        title={booking.bookingReference}
        description={`${booking.tourTitle} · ${booking.travelDate}`}
        action={
          <div className="flex gap-2">
            <button className="btn-outline text-sm">Generate Voucher</button>
            <button className="btn-outline text-sm">Generate Invoice</button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Booking Details</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-foreground/50">Customer</dt><dd className="font-medium text-foreground">{booking.customerName}</dd></div>
            <div><dt className="text-foreground/50">Travelers</dt><dd className="font-medium text-foreground">{booking.travelerCount}</dd></div>
            <div><dt className="text-foreground/50">Total Amount</dt><dd className="font-medium text-foreground">{booking.currency} {booking.totalAmount}</dd></div>
            <div><dt className="text-foreground/50">Deposit Paid</dt><dd className="font-medium text-foreground">{booking.currency} {booking.depositAmount}</dd></div>
            <div><dt className="text-foreground/50">Payment Status</dt><dd><Badge tone={paymentStatusTone(booking.paymentStatus)}>{booking.paymentStatus}</Badge></dd></div>
            <div><dt className="text-foreground/50">Booking Status</dt><dd><Badge tone={bookingStatusTone(booking.bookingStatus)}>{booking.bookingStatus}</Badge></dd></div>
          </dl>

          <h2 className="mt-8 font-heading text-lg font-semibold text-foreground">Payment History</h2>
          <div className="mt-3 space-y-2">
            {relatedPayments.length === 0 && <p className="text-sm text-foreground/50">No payments recorded yet.</p>}
            {relatedPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-secondary/10 px-4 py-3 text-sm">
                <span className="capitalize">{p.provider.replace("_", " ")} · {p.providerReference}</span>
                <span className="font-medium">{p.currency} {p.amount}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors">
              Cancel Booking
            </button>
            <button className="rounded-full border-2 border-accent px-5 py-2 text-sm font-medium text-accent hover:bg-accent hover:text-white transition-colors">
              Process Refund
            </button>
          </div>
        </div>

        <div className="card h-fit p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Customer</h2>
          {customer ? (
            <div className="mt-3 space-y-2 text-sm">
              <p className="font-medium text-foreground">{customer.fullName}</p>
              <p className="text-foreground/70">{customer.email}</p>
              <p className="text-foreground/70">{customer.phone}</p>
              <p className="text-foreground/70">{customer.nationality}</p>
              <a href={`/admin/customers/${customer.id}`} className="mt-2 inline-block text-primary hover:underline">
                View full profile →
              </a>
            </div>
          ) : (
            <p className="mt-3 text-sm text-foreground/50">Customer record not found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
