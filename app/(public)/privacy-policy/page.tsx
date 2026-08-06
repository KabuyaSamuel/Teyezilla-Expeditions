import { getSiteSetting } from "@/lib/settings";
import { DEFAULT_PRIVACY_POLICY_CONTENT } from "@/lib/legalContent";

export const metadata = { title: "Privacy Policy" };

export default async function PrivacyPolicyPage() {
  const content = (await getSiteSetting("privacyPolicyContent")) || DEFAULT_PRIVACY_POLICY_CONTENT;

  return (
    <div className="section max-w-3xl">
      <h1 className="h1-page">Privacy Policy</h1>
      <p className="mt-4 whitespace-pre-line text-foreground/70">{content}</p>
    </div>
  );
}
