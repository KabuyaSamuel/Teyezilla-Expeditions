import NavbarClient from "./NavbarClient";
import { getRegionsWithDestinations } from "@/lib/regions";
import { getJourneyTypes } from "@/lib/journeys";
import { getExperienceTypes } from "@/lib/experienceTypes";
import { getCollections } from "@/lib/collections";
import { getSafariThemes } from "@/lib/safari";

export default async function Navbar() {
  const [regions, journeyTypes, experienceTypes, collections, safariThemes] = await Promise.all([
    getRegionsWithDestinations(),
    getJourneyTypes(),
    getExperienceTypes(),
    getCollections(),
    getSafariThemes(),
  ]);

  const destinationGroups = regions
    .filter((r) => r.destinations.length > 0)
    .map((r) => ({
      label: r.name,
      links: r.destinations.slice(0, 3).map((d) => ({ label: d.countryName, href: `/destinations/${d.slug}` })),
    }));

  // /journeys filters by journeyTypes.includes(type), which holds type
  // *names* (see app/(public)/journeys/page.tsx's own filter buttons) --
  // linking by slug here silently matched nothing.
  const journeyLinks = journeyTypes.map((t) => ({ label: t.name, href: `/journeys?type=${encodeURIComponent(t.name)}` }));
  const experienceLinks = experienceTypes.map((t) => ({ label: t.name, href: `/experiences/${t.slug}` }));
  const collectionLinks = collections.map((c) => ({ label: c.name, href: `/collections/${c.slug}` }));
  const safariLinks = [
    ...safariThemes.map((t) => ({ label: t.name, href: `/safari?theme=${t.slug}#signature-safari` })),
    { label: "Safari Guide", href: "/safari#safari-guide" },
  ];

  return (
    <NavbarClient
      destinationGroups={destinationGroups}
      journeyLinks={journeyLinks}
      experienceLinks={experienceLinks}
      collectionLinks={collectionLinks}
      safariLinks={safariLinks}
    />
  );
}
