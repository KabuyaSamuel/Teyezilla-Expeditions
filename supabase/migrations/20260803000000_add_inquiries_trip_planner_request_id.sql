-- app/(public)/trip-planner/actions.ts writes every trip planner submission
-- into both `trip_planner_requests` (structured fields) and `inquiries` (so
-- it shows up in the single-inbox Inquiry Management view too), same
-- pattern as booking_id above for the booking flow. Until now there was no
-- FK between them -- lib/admin/data/inquiries.ts matched them at read time
-- by customer email ("newest request wins"), which silently mismatches a
-- returning customer's older inquiry to their newest request, and gives no
-- way to tell "genuinely never saved" apart from "matching heuristic
-- missed it". This column makes the pairing explicit and set once, at
-- insert time, instead of guessed on every read.
alter table inquiries add column trip_planner_request_id uuid references trip_planner_requests(id) on delete set null;
create index on inquiries (trip_planner_request_id);

-- Backfill using the same email-matching heuristic being retired, closest
-- request-to-inquiry pair by email and creation time (mirrors the booking_id
-- backfill above). Rows with no match are left null rather than guessed.
with matched as (
  select
    i.id as inquiry_id,
    t.id as trip_planner_request_id,
    row_number() over (
      partition by i.id
      order by abs(extract(epoch from (i.created_at - t.created_at)))
    ) as rn
  from inquiries i
  join trip_planner_requests t on t.customer_email = i.customer_email
  where i.source = 'ai_trip_planner' and i.trip_planner_request_id is null
)
update inquiries
set trip_planner_request_id = matched.trip_planner_request_id
from matched
where inquiries.id = matched.inquiry_id and matched.rn = 1;
