# Replacing placeholder images

The site's image infrastructure (responsive `sizes` on every `next/image`
use, `next.config.ts` `remotePatterns`) is already in place and doesn't need
changes. What's still a placeholder is the images themselves. This is a
content task, not a code task -- here's where every placeholder lives and
how to replace it.

## Content-managed images (replace via the admin dashboard)

Destinations, tours, journeys, and blog posts each have a `Hero Image URL`
field in their admin edit form. This is a plain URL field, not a file
picker, so replacing one is two steps:

1. **Admin → Media Library → Upload.** This uploads to Supabase Storage's
   `media` bucket and gives you a public URL.
2. **Copy that URL into the record's "Hero Image URL" field** (Admin →
   Tours/Journeys/Destinations/Blog → edit the item → save).

Right now most destinations and tours use `picsum.photos` placeholder URLs
seeded at launch; some journeys and blog posts already have real photos
uploaded this way (Media Library uploads use the Supabase Storage domain,
`*.supabase.co`).

Accommodations and vehicles have an image field in the database too, but
**the public tour/journey pages don't render it yet** (`components/
ProductAccommodations.tsx` and `components/ProductVehicles.tsx` are
text-only cards) -- uploading images for these won't show up until that
rendering is added.

## Hardcoded in components (replace by editing code)

A few images live directly in component code rather than the database:

| Location | What it is | Fix |
|---|---|---|
| `components/CategoryOverview.tsx` | 7 `picsum.photos` tiles on the homepage "Explore Teyezilla" section | Replace each `image` URL in the `CATEGORIES` array |
| `components/WhyChoose.tsx` | 1 real CC BY 2.0 Wikimedia Commons photo (credited inline) standing in for a Teyezilla photo | Replace the `src`, remove the attribution comment |
| `components/HeroCarousel.tsx` | 4 Mixkit stock videos (not `next/image` -- a plain `<video>`/`<img>` poster) | Replace the `SLIDES` array's `src`/`poster` URLs with real Teyezilla footage |
| `public/logo.png`, `public/og-image.png` | The site's actual logo mark and social-share image | **Both currently read "Teyezilla Adventures"**, not "Teyezilla Expeditions" -- this needs a corrected logo file from whoever owns the brand assets, not just a re-upload |

## Once everything is real

`next.config.ts`'s `images.remotePatterns` allowlists `picsum.photos`,
`fastly.picsum.photos` (the CDN picsum redirects to), and
`upload.wikimedia.org` specifically so those placeholders can load. Once no
page references them anymore, remove those three entries -- the Supabase
Storage hostname entry stays, since that's where real uploads live.
