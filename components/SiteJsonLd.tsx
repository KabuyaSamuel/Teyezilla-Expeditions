import { getSiteSetting } from "@/lib/settings";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { WHATSAPP_NUMBER } from "@/lib/enquiry-shared";
import JsonLd from "@/components/JsonLd";

// Site-wide Organization + WebSite schema, present on every public page via
// app/(public)/layout.tsx. Scoped to the (public) route group rather than
// the true root layout for the same reason Navbar/Footer are (see that
// layout's comment) -- meaningless on /admin, which is noindex'd anyway.
export default async function SiteJsonLd() {
  const [companyName, contactEmail, instagramUrl, facebookUrl, tiktokUrl, youtubeUrl] = await Promise.all([
    getSiteSetting("companyName"),
    getSiteSetting("contactEmail"),
    getSiteSetting("instagramUrl"),
    getSiteSetting("facebookUrl"),
    getSiteSetting("tiktokUrl"),
    getSiteSetting("youtubeUrl"),
  ]);

  const sameAs = [instagramUrl, facebookUrl, tiktokUrl, youtubeUrl].filter((url): url is string => !!url);

  return (
    <>
      <JsonLd
        data={organizationJsonLd({
          name: companyName ?? "Teyezilla Expeditions",
          email: contactEmail ?? "hello@teyezillaexpeditions.com",
          whatsappNumber: WHATSAPP_NUMBER,
          sameAs,
        })}
      />
      <JsonLd data={websiteJsonLd()} />
    </>
  );
}
