-- inquiries only had tour_id, but bookings (extended in the inquiry-based
-- model migration) can reference a journey instead of a tour. Journey
-- enquiries mirrored into the inquiries inbox were losing the structured
-- product link — the info survived only in the free-text message, so the
-- admin inquiries list couldn't show a "Journey: X" label the way it does
-- for tours.

alter table inquiries add column journey_id uuid references journeys(id);
