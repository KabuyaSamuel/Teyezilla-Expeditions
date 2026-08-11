-- Both fields were a single free-text paragraph, which is how the tour/
-- journey "Please Note" section ended up as one dense wall of text (staff
-- write these as a list of discrete points -- pickup time, what to bring,
-- health restrictions, etc. -- but had nowhere to enter them as one). Same
-- text[] + "one item per line" pattern already used for inclusions/
-- exclusions/bring_list. Existing values are wrapped as a single-element
-- array rather than auto-split on sentence boundaries -- a naive split on
-- ". " would break on things like "1.5 to 2 hours" -- so existing content
-- is preserved as-is and staff can re-split it into proper bullets next
-- time they edit that tour/journey.
alter table tours
  alter column important_info type text[]
  using (case when important_info is null or important_info = '' then null else array[important_info] end);
alter table tours
  alter column cancellation_policy type text[]
  using (case when cancellation_policy is null or cancellation_policy = '' then null else array[cancellation_policy] end);

alter table journeys
  alter column important_info type text[]
  using (case when important_info is null or important_info = '' then null else array[important_info] end);
alter table journeys
  alter column cancellation_policy type text[]
  using (case when cancellation_policy is null or cancellation_policy = '' then null else array[cancellation_policy] end);
