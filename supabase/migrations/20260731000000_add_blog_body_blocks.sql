-- Simple block-based content editor for blog posts (paragraph, headings,
-- lists, to-do, toggle, quote, callout, code) instead of a single plain-text
-- body. Additive/nullable-defaulted — the legacy `body` text column stays
-- as a fallback for posts that haven't been converted to blocks yet.
alter table blog_posts add column body_blocks jsonb default '[]'::jsonb;
