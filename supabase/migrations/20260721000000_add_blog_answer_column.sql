-- Public blog posts show a short "answer-first" block (for AEO/GEO) above
-- the full body — a distinct field from `excerpt` (used in listing cards)
-- and `body` (the full article). Add it so the public article content can
-- move into the database instead of living hardcoded in app/blog/[slug]/page.tsx.
alter table blog_posts add column answer text;
