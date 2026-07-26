-- Booking flow becomes inquiry-based. Online payment (Stripe/M-Pesa/PayPal)
-- is permanently out of scope: visitors enquire, staff quote and confirm by
-- email/WhatsApp, and payment happens offline. payment_status stays as a
-- manual record-keeping field only.

-- ============ BOOKING STATUS ============
-- Migrate existing rows to the new vocabulary BEFORE swapping constraints,
-- so the new checks don't fail on seed/legacy data.
alter table bookings drop constraint bookings_booking_status_check;

update bookings set booking_status = 'inquiry' where booking_status = 'pending';

alter table bookings add constraint bookings_booking_status_check
  check (booking_status in ('inquiry', 'quoted', 'confirmed', 'completed', 'cancelled'));
alter table bookings alter column booking_status set default 'inquiry';

-- ============ PAYMENT STATUS ============
alter table bookings drop constraint bookings_payment_status_check;

update bookings set payment_status = 'unpaid' where payment_status in ('pending', 'refunded');
update bookings set payment_status = 'deposit_received' where payment_status = 'partial';

alter table bookings add constraint bookings_payment_status_check
  check (payment_status in ('unpaid', 'deposit_received', 'paid'));
alter table bookings alter column payment_status set default 'unpaid';

-- ============ ENQUIRY FIELDS ============
-- Travel date becomes nullable (flexible-dates enquiries)
alter table bookings alter column travel_date drop not null;
alter table bookings add column flexible_dates boolean default false;
alter table bookings add column adults int;
alter table bookings add column children int default 0;
alter table bookings add column children_ages text;
alter table bookings add column budget_range text;
alter table bookings add column special_requests text;
alter table bookings add column referral_source text;
alter table bookings add column country_of_residence text;
alter table bookings add column journey_id uuid references journeys(id);
-- (tour_id already exists; a booking enquiry references a tour OR a journey)

-- ============ ANONYMOUS ENQUIRY POLICIES ============
-- Anonymous visitors can create enquiries (insert only — no read/update/delete)
create policy "Anyone can create a booking enquiry" on bookings
  for insert with check (booking_status = 'inquiry');
create policy "Anyone can create a customer record via enquiry" on customers
  for insert with check (true);
create policy "Anyone can submit a trip planner request" on trip_planner_requests
  for insert with check (true);
