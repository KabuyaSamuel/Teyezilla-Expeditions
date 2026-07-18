import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Trip",
  description: "Book a tour with Teyezilla Expeditions: choose dates, travelers, and pay a deposit or in full.",
};

export default function BookingPage() {
  return (
    <div className="section max-w-2xl">
      <h1 className="font-heading text-4xl font-bold text-foreground">Book Your Trip</h1>
      <p className="mt-3 text-foreground/70">
        Payment integrations (Stripe, M-Pesa, PayPal) are wired up in Phase 4. This form
        captures the booking details in the meantime.
      </p>
      <form className="mt-8 space-y-4">
        <input type="date" className="w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <input type="number" min={1} placeholder="Number of travelers" className="w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <input type="email" placeholder="Email for confirmation" className="w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="radio" name="payment" defaultChecked /> Pay Deposit</label>
          <label className="flex items-center gap-2 text-sm"><input type="radio" name="payment" /> Pay in Full</label>
        </div>
        <button type="submit" className="btn-primary">Continue to Payment</button>
      </form>
    </div>
  );
}
