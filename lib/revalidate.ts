import { revalidatePath } from "next/cache";

// Public pages are ISR-cached (see each page's `revalidate = 3600`), so a
// save in the admin dashboard otherwise stays invisible on the live site
// for up to an hour. The existing revalidatePath calls in most admin
// actions only ever targeted that entity's own index page (e.g.
// "/journeys"), never the homepage's featured sections or the entity's own
// detail page ("/journeys/[slug]") -- and shared library entities
// (activities, vehicles, accommodations) didn't revalidate any public page
// at all, so adding one never showed up wherever it got attached. That's
// what caused two real, reported bugs: a journey marked featured not
// appearing on the homepage, and an addon price edit not appearing on that
// journey's own page.
//
// Precisely enumerating every public page a given tour/journey/activity/
// vehicle/accommodation could appear on (its own page, destination pages,
// collections, experience categories, the homepage, related-content
// sections elsewhere...) is exactly the kind of thing that's easy to miss
// a case on -- which is how we got here. Busting the whole public route
// tree is simpler and more reliable; ISR regeneration is cheap, and
// correctness matters more here than shaving a few rebuilds.
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
}
