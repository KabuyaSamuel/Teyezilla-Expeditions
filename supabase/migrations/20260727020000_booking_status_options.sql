-- Makes booking_status / payment_status a CMS-managed list instead of a
-- hardcoded vocabulary, so staff can add/rename/reorder/remove options
-- without a code change. Validation moves from a DB check constraint to the
-- application layer (server actions check against the current option list).

create table status_options (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('booking_status', 'payment_status')),
  key text not null,
  label text not null,
  tone text not null default 'neutral' check (tone in ('success', 'error', 'pending', 'info', 'neutral')),
  display_order integer not null default 0,
  created_at timestamptz default now(),
  unique (category, key)
);

alter table status_options enable row level security;

create policy "Staff can manage status options"
  on status_options for all
  to authenticated
  using (true) with check (true);

-- Seed with the exact values/labels/tones the app already hardcodes, so
-- existing bookings keep working identically the moment this ships.
insert into status_options (category, key, label, tone, display_order) values
  ('booking_status', 'inquiry', 'Inquiry', 'info', 0),
  ('booking_status', 'quoted', 'Quoted', 'pending', 1),
  ('booking_status', 'confirmed', 'Confirmed', 'success', 2),
  ('booking_status', 'completed', 'Completed', 'success', 3),
  ('booking_status', 'cancelled', 'Cancelled', 'error', 4),
  ('payment_status', 'unpaid', 'Unpaid', 'neutral', 0),
  ('payment_status', 'deposit_received', 'Deposit received', 'pending', 1),
  ('payment_status', 'paid', 'Paid', 'success', 2);

-- Drop the fixed vocabulary check constraints — the status_options table is
-- now the source of truth, enforced in the server actions instead.
alter table bookings drop constraint if exists bookings_booking_status_check;
alter table bookings drop constraint if exists bookings_payment_status_check;
