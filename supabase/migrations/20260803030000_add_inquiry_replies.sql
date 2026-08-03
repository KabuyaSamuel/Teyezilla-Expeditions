-- inquiries.staff_reply/replied_at only ever held the single most recent
-- reply, overwritten on every send -- there was no thread, so staff lost
-- the history of what was already said to a customer. This table makes
-- replies a proper one-to-many list; staff_reply/replied_at are left in
-- place (still updated, for the list page's "Replied" badge and this
-- table's own "last replied" timestamp) rather than dropped, since removing
-- a column is a one-way trip and nothing here needs that column gone.
create table inquiry_replies (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references inquiries(id) on delete cascade,
  message text not null,
  sent_via_email boolean not null default false,
  created_by uuid references staff(id) on delete set null,
  created_at timestamptz default now()
);
create index on inquiry_replies (inquiry_id);

alter table inquiry_replies enable row level security;
create policy "Staff can manage inquiry replies" on inquiry_replies for all
  to authenticated using (true) with check (true);

-- Backfill: one reply row per inquiry that already has a staff_reply.
-- sent_via_email is left false for these -- historically "Send via Email"
-- was just a mailto: link the staff member's own mail client opened, never
-- tracked here, so there's no way to know which of these were actually sent.
insert into inquiry_replies (inquiry_id, message, sent_via_email, created_at)
select id, staff_reply, false, coalesce(replied_at, created_at)
from inquiries
where staff_reply is not null and staff_reply != '';
