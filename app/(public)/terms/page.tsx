import { getSiteSetting } from "@/lib/settings";
import { DEFAULT_TERMS_CONTENT } from "@/lib/legalContent";

export const metadata = { title: "Terms & Conditions" };

export default async function TermsPage() {
  const content = (await getSiteSetting("termsContent")) || DEFAULT_TERMS_CONTENT;

  return (
    <div className="section max-w-3xl">
      <h1 className="h1-page">Terms & Conditions</h1>
      <p className="mt-4 whitespace-pre-line text-foreground/70">{content}</p>
    </div>
  );
}
