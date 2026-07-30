-- app/booking/actions.ts writes every booking enquiry into both `bookings`
-- and `inquiries` (so it shows up in the single-inbox Inquiry Management
-- view too). The dashboard's "New Enquiries" stat summed both tables with
-- no way to know they were the same lead, double-counting every booking
-- enquiry. This column makes the pairing explicit so callers can exclude
-- booking-derived inquiries from general enquiry counts, and so the two
-- admin screens can cross-link to each other.
alter table inquiries add column booking_id uuid references bookings(id) on delete set null;
create index on inquiries (booking_id);

-- Backfill: link each already-existing website-sourced inquiry to the
-- booking it was mirrored from. app/booking/actions.ts inserts both rows
-- back-to-back in the same request, so a confident match is: same customer
-- email, same tour/journey, and created within 5 minutes of each other.
-- For each inquiry, pick the closest-in-time candidate so one inquiry never
-- links to more than one booking. Rows with no confident match are left
-- null rather than guessed.
with matched as (
  select
    i.id as inquiry_id,
    b.id as booking_id,
    row_number() over (
      partition by i.id
      order by abs(extract(epoch from (i.created_at - b.created_at)))
    ) as rn
  from inquiries i
  join bookings b
    on (
      (i.tour_id is not null and i.tour_id = b.tour_id) or
      (i.journey_id is not null and i.journey_id = b.journey_id)
    )
    and abs(extract(epoch from (i.created_at - b.created_at))) < 300
  join customers c on c.id = b.customer_id and c.email = i.customer_email
  where i.source = 'website' and i.booking_id is null
)
update inquiries
set booking_id = matched.booking_id
from matched
where inquiries.id = matched.inquiry_id and matched.rn = 1;
