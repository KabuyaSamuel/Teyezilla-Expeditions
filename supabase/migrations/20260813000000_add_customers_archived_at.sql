-- Soft-delete for customers. bookings.customer_id has no ON DELETE clause
-- (defaults to RESTRICT), and loyalty_transactions.customer_id cascades on
-- delete -- a hard delete either fails outright for anyone with bookings or
-- silently destroys payment/loyalty history for anyone without. Archiving
-- keeps that history intact and out of the default admin list instead.
alter table customers add column archived_at timestamptz;
