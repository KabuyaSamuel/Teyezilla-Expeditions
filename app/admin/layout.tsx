import type { Metadata } from "next";

// Wraps every /admin/* route (login, logout, and the whole (dashboard)
// group -- route groups don't break layout nesting, so this sits above
// all of them). robots.txt already disallows /admin, but that only tells
// well-behaved crawlers not to *crawl* it; it doesn't guarantee Google
// won't still list a URL it discovers some other way (e.g. a link shared
// outside the app). A noindex directive on the page itself is the actual
// guarantee. This is why the admin dashboard's Lighthouse SEO score isn't
// (and shouldn't be) 100 -- "page is blocked from indexing" is exactly
// the point here, not a bug.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
