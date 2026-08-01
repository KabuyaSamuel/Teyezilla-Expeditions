-- Short experiences (e.g. a 4-hour Tuk Tuk tour) need duration in hours,
-- not just whole days. Additive/nullable — duration_days stays the primary
-- field for multi-day products; duration_hours is set instead for anything
-- under a day, and display logic prefers it when present.
alter table tours add column duration_hours integer;
