-- Backfill related_type/related_id for notifications created before that
-- column existed. new_booking/payment_confirmed/tour_reminder messages all
-- embed a booking reference somewhere in the text (e.g. "New booking
-- TZ-10234 for ...", "... (KE-16487) ..."), extracted here and matched
-- against bookings.booking_reference. Rows with no confident match are
-- left null rather than guessed.
with booking_matches as (
  select
    n.id as notification_id,
    b.id as booking_id
  from notifications n
  join bookings b
    on b.booking_reference = substring(n.message from '[A-Z]{2}-[0-9]+')
  where n.related_id is null
    and n.type in ('new_booking', 'payment_confirmed', 'tour_reminder')
)
update notifications
set related_type = 'booking', related_id = booking_matches.booking_id
from booking_matches
where notifications.id = booking_matches.notification_id;

-- follow_up notifications from the old "Inquiry from <name> needs a
-- follow-up." wording have no embedded reference, so match by extracted
-- customer name against inquiries.customer_name, closest-in-time when a
-- name matches more than one inquiry.
with name_matches as (
  select
    n.id as notification_id,
    i.id as inquiry_id,
    row_number() over (
      partition by n.id
      order by abs(extract(epoch from (n.created_at - i.created_at)))
    ) as rn
  from notifications n
  join inquiries i
    on i.customer_name = substring(n.message from 'Inquiry from (.*) needs a follow-up')
  where n.related_id is null
    and n.type = 'follow_up'
    and n.message like 'Inquiry from % needs a follow-up.'
)
update notifications
set related_type = 'inquiry', related_id = name_matches.inquiry_id
from name_matches
where notifications.id = name_matches.notification_id and name_matches.rn = 1;

-- Same idea for the old trip-planner wording ("New trip planner request
-- from <name> for <destination>."), matched against ai_trip_planner
-- inquiries by customer name, closest-in-time when ambiguous.
with trip_planner_matches as (
  select
    n.id as notification_id,
    i.id as inquiry_id,
    row_number() over (
      partition by n.id
      order by abs(extract(epoch from (n.created_at - i.created_at)))
    ) as rn
  from notifications n
  join inquiries i
    on i.source = 'ai_trip_planner'
    and i.customer_name = substring(n.message from 'New trip planner request from (.*) for ')
  where n.related_id is null
    and n.type = 'follow_up'
    and n.message like 'New trip planner request from % for %.'
)
update notifications
set related_type = 'inquiry', related_id = trip_planner_matches.inquiry_id
from trip_planner_matches
where notifications.id = trip_planner_matches.notification_id and trip_planner_matches.rn = 1;
