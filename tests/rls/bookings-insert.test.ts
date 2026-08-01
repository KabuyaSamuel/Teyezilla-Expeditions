// The public enquiry form depends entirely on "Anyone can create a booking
// enquiry" allowing an anonymous insert -- but only with
// booking_status='inquiry'. If that check ever got dropped or loosened, an
// anonymous visitor could insert a booking that's already "confirmed",
// bypassing the whole staff quote/confirm flow.
//
// Also locks in a real bug this suite caught: bookings has no anon SELECT
// policy, so chaining .select() after an anon insert turns it into a single
// `INSERT ... RETURNING` statement that fails RLS entirely, even though a
// plain insert without RETURNING succeeds. app/(public)/booking/actions.ts
// was fixed to only request the row back through the service-role client.

import { describe, it, expect, afterEach } from "vitest";
import { anonClient, serviceClient } from "./helpers";

describe("bookings insert RLS", () => {
  let createdId: string | null = null;
  let createdReference: string | null = null;

  afterEach(async () => {
    const service = serviceClient();
    if (createdId) {
      await service.from("bookings").delete().eq("id", createdId);
      createdId = null;
    }
    if (createdReference) {
      await service.from("bookings").delete().eq("booking_reference", createdReference);
      createdReference = null;
    }
  });

  it("allows a plain anonymous insert with booking_status='inquiry' (no .select() -- see note above)", async () => {
    createdReference = `__rls_test_${Date.now()}__`;
    const { error } = await anonClient()
      .from("bookings")
      .insert({ booking_reference: createdReference, booking_status: "inquiry", payment_status: "unpaid", traveler_count: 1 });
    expect(error).toBeNull();

    const { data: row } = await serviceClient().from("bookings").select("id").eq("booking_reference", createdReference).maybeSingle();
    expect(row?.id).toBeTruthy();
  });

  it("blocks an anonymous insert with booking_status='confirmed'", async () => {
    const { error } = await anonClient()
      .from("bookings")
      .insert({ booking_reference: `__rls_test_${Date.now()}__`, booking_status: "confirmed", payment_status: "unpaid" });
    expect(error).not.toBeNull();
  });

  it("blocks the anon client from reading bookings back (insert-only policy)", async () => {
    const service = serviceClient();
    const { data: seed } = await service
      .from("bookings")
      .insert({ booking_reference: `__rls_test_${Date.now()}__`, booking_status: "inquiry", payment_status: "unpaid", traveler_count: 1 })
      .select("id")
      .single();
    createdId = seed?.id ?? null;

    const { data } = await anonClient().from("bookings").select("id").eq("id", createdId!).maybeSingle();
    expect(data).toBeNull();
  });
});
