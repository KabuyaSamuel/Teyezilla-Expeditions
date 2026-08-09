# Replacing placeholder images

The site's image infrastructure (responsive `sizes` on every `next/image`
use, `next.config.ts` `remotePatterns`) is already in place and doesn't need
changes.

## Content-managed images (replace via the admin dashboard)

Destinations, tours, journeys, and blog posts each have a `Hero Image URL`
field in their admin edit form. This is a plain URL field, not a file
picker, so replacing one is two steps:

1. **Admin → Media Library → Upload.** This uploads to Supabase Storage's
   `media` bucket and gives you a public URL.
2. **Copy that URL into the record's "Hero Image URL" field** (Admin →
   Tours/Journeys/Destinations/Blog → edit the item → save).

All destinations, tours, journeys, and blog posts use real Media Library
photos as of this pass -- `picsum.photos` placeholders have been fully
replaced, reusing existing uploads across multiple records where no
dedicated photo exists yet (e.g. the same Kenya photo standing in for
South Africa) rather than leaving a placeholder in place. `og_image`
columns were updated the same way, generally mirroring each record's
`hero_image`.

The homepage's "Explore Teyezilla" category tiles (Destinations, Journeys,
Experiences, Collections, Safari, Bespoke, Journal) read from
`site_settings` (Admin → Settings) with a fallback to the defaults in
`lib/homepageContent.ts` -- both were also on picsum and have been updated
to real Media Library photos.

Accommodations and vehicles have an image field in the database too, but
**the public tour/journey pages don't render it yet** (`components/
ProductAccommodations.tsx` and `components/ProductVehicles.tsx` are
text-only cards) -- uploading images for these won't show up until that
rendering is added.

## Hardcoded in components (replace by editing code)

A few images live directly in component code rather than the database:

| Location | What it is | Fix |
| --- | --- | --- |
| `components/WhyChoose.tsx` | Real photo (`whyChooseImage` in `site_settings`/`lib/homepageContent.ts`) | Already a real upload, not a placeholder |
| `components/HeroCarousel.tsx` | Renders whatever slides come back from `lib/hero.ts` (admin-managed via Admin → Settings → Hero Slides, `components/admin/HeroSlidesEditor.tsx`) | Manage via the admin Hero Slides editor, not by editing this file |
| `public/logo.png`, `public/og-image.png` | The site's logo mark and social-share image | Already corrected to read "Teyezilla Expeditions" |

## Remaining known placeholder

`components/WhyChoose.tsx`'s CC BY 2.0 Wikimedia Commons photo credit
comment can be removed once `whyChooseImage` (already a real Media
Library upload) is confirmed to no longer reference the Wikimedia file --
check `site_settings` before assuming the inline attribution is stale.
