-- Lets staff record the reply they sent (no email/WhatsApp API is wired up
-- yet — Phase 4 — so "answering" an inquiry means writing the reply here
-- and sending it via the existing external channel, same pattern as the
-- booking refund ledger).
alter table inquiries add column staff_reply text;
alter table inquiries add column replied_at timestamptz;
