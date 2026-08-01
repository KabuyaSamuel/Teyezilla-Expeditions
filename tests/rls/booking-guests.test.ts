// booking_guests (added this session) deliberately has no anon policy at
// all -- guest rosters are staff-entered after an inquiry is confirmed,
// never touched by the public enquiry form. This is the most privacy-
// sensitive table added this session (passport numbers, dietary info), so
// it gets its own explicit test rather than relying on the pattern tests
// above to imply it.

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { anonClient, serviceClient } from "./helpers";

describe("booking_guests RLS", () => {
  let bookingId: string;
  let guestId: string;

  beforeAll(async () => {
    const service = serviceClient();

    const { data: booking, error: bookingError } = await service
      .from("bookings")
      .insert({ booking_reference: `__rls_test_${Date.now()}__`, booking_status: "inquiry", payment_status: "unpaid", traveler_count: 1 })
      .select("id")
      .single();
    if (bookingError || !booking) throw new Error(`Failed to create test booking: ${bookingError?.message}`);
    bookingId = booking.id;

    const { data: guest, error: guestError } = await service
      .from("booking_guests")
      .insert({ booking_id: bookingId, full_name: "__rls_test_guest__" })
      .select("id")
      .single();
    if (guestError || !guest) throw new Error(`Failed to create test booking guest: ${guestError?.message}`);
    guestId = guest.id;
  });

  afterAll(async () => {
    const service = serviceClient();
    await service.from("booking_guests").delete().eq("id", guestId);
    await service.from("bookings").delete().eq("id", bookingId);
  });

  it("hides guest rosters entirely from the anon client (no anon select policy)", async () => {
    const { data } = await anonClient().from("booking_guests").select("id").eq("id", guestId).maybeSingle();
    expect(data).toBeNull();
  });

  it("blocks the anon client from inserting a guest row (no anon insert policy)", async () => {
    const { error } = await anonClient()
      .from("booking_guests")
      .insert({ booking_id: bookingId, full_name: "__rls_test_should_be_blocked__" });
    expect(error).not.toBeNull();
  });

  it("exposes the guest roster to the service-role client (what staff use)", async () => {
    const { data } = await serviceClient().from("booking_guests").select("id").eq("id", guestId).maybeSingle();
    expect(data?.id).toBe(guestId);
  });
});
