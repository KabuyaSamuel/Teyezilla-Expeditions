-- attractions and accommodations (from 20260723000000_ia_redesign_schema.sql)
-- have no rows, no admin CRUD, and no public consumption -- the "Destination
-- Management" sidebar description advertised "attractions, hotels" as a
-- managed capability when nothing manages them. Rather than build unused
-- admin CRUD for empty tables, the description was corrected instead
-- (lib/admin/permissions.ts); these comments record that these tables are
-- reserved for a later phase so the schema itself doesn't imply they're wired up.
comment on table attractions is 'Reserved for a later phase: no admin CRUD or public consumption yet. Do not assume rows exist.';
comment on table accommodations is 'Reserved for a later phase: no admin CRUD or public consumption yet. Do not assume rows exist.';
