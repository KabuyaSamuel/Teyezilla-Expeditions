-- Real link-based attribution (which ad/post/campaign actually drove a
-- lead), distinct from the existing self-reported "How did you hear about
-- us?" referral_source dropdown -- the two answer different questions and
-- both stay. Captured client-side from ?utm_source/utm_medium/utm_campaign
-- on landing (see components/UtmCapture.tsx), stored in a first-party
-- cookie, and read server-side at the point a booking/inquiry is created.
alter table bookings add column utm_source text;
alter table bookings add column utm_medium text;
alter table bookings add column utm_campaign text;

alter table inquiries add column utm_source text;
alter table inquiries add column utm_medium text;
alter table inquiries add column utm_campaign text;
