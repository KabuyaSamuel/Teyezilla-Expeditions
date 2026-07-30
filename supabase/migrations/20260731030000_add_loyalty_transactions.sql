-- customers.loyalty_points was a bare integer any staff member could
-- overwrite directly -- no record of why a balance changed, and any
-- accidental overwrite was silent, unrecoverable data loss. Replaces it with
-- a ledger: every change to a customer's balance is a row here, and
-- customers.loyalty_points becomes a cached total kept in sync on every
-- write (kept because list views and sorting by balance are much simpler
-- against a plain column than a recomputed aggregate). loyalty_transactions
-- is the source of truth; customers.loyalty_points is a derived cache.
create table loyalty_transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  points_delta integer not null,            -- positive = earned, negative = redeemed
  reason text not null,                     -- required, human-readable, always
  booking_id uuid references bookings(id),  -- set when accrual/redemption ties to a booking
  created_by uuid references staff(id),     -- who made this adjustment
  created_at timestamptz default now()
);
create index on loyalty_transactions (customer_id);
create index on loyalty_transactions (booking_id);

alter table loyalty_transactions enable row level security;

-- Staff-only, no anon access. This codebase has no separate is_staff()
-- helper -- every other staff-only table (notifications, bookings writes,
-- customers writes, etc., see 20260718163423_add_rls_policies.sql) is
-- gated with `to authenticated using (true)` because the only authenticated
-- identity in this app is admin staff via Supabase Auth. Matching that
-- existing convention here rather than introducing a new, differently-named
-- helper for one table.
create policy "Staff can manage loyalty transactions"
  on loyalty_transactions for all
  to authenticated
  using (true) with check (true);

-- Single write path for both the transaction row and the cached balance, so
-- the two can never drift out of sync (a bare insert + separate update from
-- application code could fail between the two steps and leave them
-- inconsistent). Runs with the caller's own privileges (not security
-- definer), so it's still subject to the RLS policy above.
create or replace function apply_loyalty_transaction(
  p_customer_id uuid,
  p_points_delta integer,
  p_reason text,
  p_booking_id uuid default null,
  p_created_by uuid default null
) returns void
language plpgsql
as $$
begin
  insert into loyalty_transactions (customer_id, points_delta, reason, booking_id, created_by)
  values (p_customer_id, p_points_delta, p_reason, p_booking_id, p_created_by);

  update customers
  set loyalty_points = loyalty_points + p_points_delta
  where id = p_customer_id;
end;
$$;

-- Backfill: every customer with a non-zero balance today got there through
-- undocumented direct edits. Give each one a single opening-balance
-- transaction so no point on the ledger is ever unexplained, without
-- guessing at a reason that was never recorded.
insert into loyalty_transactions (customer_id, points_delta, reason)
select id, loyalty_points, 'Opening balance (migrated)'
from customers
where loyalty_points is not null and loyalty_points != 0;
