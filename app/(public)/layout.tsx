import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileTabBar from "@/components/MobileTabBar";
import SiteJsonLd from "@/components/SiteJsonLd";
import { WHATSAPP_NUMBER } from "@/lib/enquiry-shared";

// This route group is exactly the public site (everything except /admin).
// Scoping the marketing Navbar/Footer/WhatsApp button to this layout,
// instead of the true root layout, is what keeps them out of the admin
// dashboard without any dynamic per-request check -- admin pages simply
// live outside this group, so they never render this layout at all. Doing
// the split with a pathname check in the root layout instead would force
// every route (including every public page) into dynamic rendering, since
// reading headers()/pathname there is a dynamic API that opts the whole
// app out of static generation.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteJsonLd />
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <WhatsAppButton phoneNumber={WHATSAPP_NUMBER} />
      <MobileTabBar phoneNumber={WHATSAPP_NUMBER} />
    </>
  );
}
