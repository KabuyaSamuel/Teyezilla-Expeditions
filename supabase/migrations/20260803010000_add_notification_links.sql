-- Notifications had no way to link back to the record they're about --
-- staff could see "New enquiry for Maasai Mara Safari from Jane Doe" but
-- couldn't click through to it, only re-find it manually in Booking/Inquiry
-- Management. related_type/related_id let the admin UI turn a notification
-- into a direct link, same idea as inquiries.booking_id and
-- inquiries.trip_planner_request_id above -- store the real reference at
-- write time instead of asking staff to search for it.
alter table notifications add column related_type text check (related_type in ('booking', 'inquiry'));
alter table notifications add column related_id uuid;
create index on notifications (related_type, related_id);
