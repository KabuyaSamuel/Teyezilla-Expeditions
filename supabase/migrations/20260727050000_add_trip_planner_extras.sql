-- Optional add-on services a traveler can request alongside their trip
-- (private vehicle, airport assistance, flight booking, etc.).
alter table trip_planner_requests add column extras text[];
