-- Needed to delete the underlying Storage object when a media row is
-- deleted — deriving the path back out of file_url is fragile.
alter table media add column storage_path text;
