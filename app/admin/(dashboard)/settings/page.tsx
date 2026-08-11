import PageHeader from "@/components/admin/PageHeader";
import HeroSlidesEditor from "@/components/admin/HeroSlidesEditor";
import SettingsImageField from "@/components/admin/SettingsImageField";
import SettingsTabs from "@/components/admin/SettingsTabs";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSiteSetting } from "@/lib/settings";
import { getHeroSlides, HERO_TEXT_DEFAULTS } from "@/lib/hero";
import { getMediaItems } from "@/lib/admin/data/media";
import {
  WHY_CHOOSE_DEFAULTS,
  TRUST_INDICATORS_DEFAULTS,
  CATEGORY_OVERVIEW_DEFAULTS,
  BESPOKE_PAGE_DEFAULTS,
  CATEGORY_DESCRIPTION_MAX_LENGTH,
  EXPERIENCES_PAGE_DEFAULTS,
  JOURNEYS_PAGE_DEFAULTS,
  COLLECTIONS_PAGE_DEFAULTS,
  SAFARI_PAGE_DEFAULTS,
} from "@/lib/homepageContent";
import {
  DEFAULT_TERMS_CONTENT,
  DEFAULT_PRIVACY_POLICY_CONTENT,
  DEFAULT_CANCELLATION_POLICY_CONTENT,
} from "@/lib/legalContent";
import { LOYALTY_ACCRUAL_SETTING_KEY, LOYALTY_ACCRUAL_DEFAULT } from "@/lib/loyalty-shared";

// Ordered by priority: identity and first-impression content (company info,
// homepage) come first since they're the most foundational and most
// frequently revisited; legal/trust content next; then progressively more
// niche or "set once and forget" operational settings, with the
// code-pointer-only Email Templates section last since there's nothing to
// action on this page for it.
const SETTINGS_KEYS = [
  "companyName",
  "tagline",
  "contactEmail",
  "whatsappNumber",
  "happy_travelers_count",
  ...(Object.keys(HERO_TEXT_DEFAULTS) as (keyof typeof HERO_TEXT_DEFAULTS)[]),
  ...(Object.keys(WHY_CHOOSE_DEFAULTS) as (keyof typeof WHY_CHOOSE_DEFAULTS)[]),
  ...(Object.keys(TRUST_INDICATORS_DEFAULTS) as (keyof typeof TRUST_INDICATORS_DEFAULTS)[]),
  ...(Object.keys(CATEGORY_OVERVIEW_DEFAULTS) as (keyof typeof CATEGORY_OVERVIEW_DEFAULTS)[]),
  ...(Object.keys(BESPOKE_PAGE_DEFAULTS) as (keyof typeof BESPOKE_PAGE_DEFAULTS)[]),
  ...(Object.keys(EXPERIENCES_PAGE_DEFAULTS) as (keyof typeof EXPERIENCES_PAGE_DEFAULTS)[]),
  ...(Object.keys(JOURNEYS_PAGE_DEFAULTS) as (keyof typeof JOURNEYS_PAGE_DEFAULTS)[]),
  ...(Object.keys(COLLECTIONS_PAGE_DEFAULTS) as (keyof typeof COLLECTIONS_PAGE_DEFAULTS)[]),
  ...(Object.keys(SAFARI_PAGE_DEFAULTS) as (keyof typeof SAFARI_PAGE_DEFAULTS)[]),
  "termsContent",
  "privacyPolicyContent",
  "cancellationPolicyContent",
  "instagramUrl",
  "facebookUrl",
  "tiktokUrl",
  "youtubeUrl",
  "defaultCurrency",
  "defaultLanguage",
  "defaultMetaTitle",
  "defaultMetaDescription",
  LOYALTY_ACCRUAL_SETTING_KEY,
] as const;

const DEFAULTS: Record<(typeof SETTINGS_KEYS)[number], string> = {
  companyName: "Teyezilla Expeditions",
  tagline: "Extraordinary Journeys Across Africa",
  contactEmail: "hello@teyezillaexpeditions.com",
  whatsappNumber: "254726584159",
  happy_travelers_count: "1000",
  ...HERO_TEXT_DEFAULTS,
  ...WHY_CHOOSE_DEFAULTS,
  ...TRUST_INDICATORS_DEFAULTS,
  ...CATEGORY_OVERVIEW_DEFAULTS,
  ...BESPOKE_PAGE_DEFAULTS,
  ...EXPERIENCES_PAGE_DEFAULTS,
  ...JOURNEYS_PAGE_DEFAULTS,
  ...COLLECTIONS_PAGE_DEFAULTS,
  ...SAFARI_PAGE_DEFAULTS,
  termsContent: DEFAULT_TERMS_CONTENT,
  privacyPolicyContent: DEFAULT_PRIVACY_POLICY_CONTENT,
  cancellationPolicyContent: DEFAULT_CANCELLATION_POLICY_CONTENT,
  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
  youtubeUrl: "",
  defaultCurrency: "USD",
  defaultLanguage: "EN",
  defaultMetaTitle: "Teyezilla Expeditions | Extraordinary Journeys Across Africa",
  defaultMetaDescription: "Discover Africa with Teyezilla Expeditions.",
  [LOYALTY_ACCRUAL_SETTING_KEY]: String(LOYALTY_ACCRUAL_DEFAULT),
};

export default async function AdminSettingsPage() {
  const [settingsValues, heroSlides, mediaItems] = await Promise.all([
    Promise.all(SETTINGS_KEYS.map((key) => getSiteSetting(key))),
    getHeroSlides(),
    getMediaItems(),
  ]);
  const settings = Object.fromEntries(
    SETTINGS_KEYS.map((key, i) => [key, settingsValues[i] ?? DEFAULTS[key]])
  ) as Record<(typeof SETTINGS_KEYS)[number], string>;

  return (
    <div className="space-y-6">
      <PageHeader title="Website Settings" description="Company info, contact details, currency, and SEO defaults." />

      <SettingsForm>
        <SettingsTabs
          tabs={[
            {
              id: "company",
              label: "Company & Contact",
              content: (
                <>
                  <section className="card grid gap-4 p-6 sm:grid-cols-2">
                    <h2 className="font-heading text-lg font-semibold text-foreground sm:col-span-2">Company Information</h2>
                    <div>
                      <label htmlFor="companyName" className="text-xs font-medium text-foreground/60">Company Name</label>
                      <input id="companyName" name="companyName" defaultValue={settings.companyName} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label htmlFor="tagline" className="text-xs font-medium text-foreground/60">Tagline</label>
                      <input id="tagline" name="tagline" defaultValue={settings.tagline} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label htmlFor="contactEmail" className="text-xs font-medium text-foreground/60">Contact Email</label>
                      <input id="contactEmail" name="contactEmail" defaultValue={settings.contactEmail} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label htmlFor="whatsappNumber" className="text-xs font-medium text-foreground/60">WhatsApp Number</label>
                      <input id="whatsappNumber" name="whatsappNumber" defaultValue={settings.whatsappNumber} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </section>

                  <section className="card grid gap-4 p-6 sm:grid-cols-2">
                    <h2 className="font-heading text-lg font-semibold text-foreground sm:col-span-2">Social Links</h2>
                    <input id="instagramUrl" name="instagramUrl" defaultValue={settings.instagramUrl} placeholder="Instagram URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input id="facebookUrl" name="facebookUrl" defaultValue={settings.facebookUrl} placeholder="Facebook URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input id="tiktokUrl" name="tiktokUrl" defaultValue={settings.tiktokUrl} placeholder="TikTok URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input id="youtubeUrl" name="youtubeUrl" defaultValue={settings.youtubeUrl} placeholder="YouTube URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </section>

                  <section className="card grid gap-4 p-6 sm:grid-cols-2">
                    <h2 className="font-heading text-lg font-semibold text-foreground sm:col-span-2">Currency & Language</h2>
                    <div>
                      <label htmlFor="defaultCurrency" className="text-xs font-medium text-foreground/60">Default Currency</label>
                      <select id="defaultCurrency" name="defaultCurrency" defaultValue={settings.defaultCurrency} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>USD</option><option>EUR</option><option>KES</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="defaultLanguage" className="text-xs font-medium text-foreground/60">Default Language</label>
                      <select id="defaultLanguage" name="defaultLanguage" defaultValue={settings.defaultLanguage} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>EN</option><option>FR</option><option>SW</option>
                      </select>
                    </div>
                  </section>
                </>
              ),
            },
            {
              id: "homepage",
              label: "Homepage",
              content: (
                <>
                  <section className="card p-6">
                    <h2 className="font-heading text-lg font-semibold text-foreground">Homepage Hero</h2>
                    <p className="mt-1 text-xs text-foreground/50">The hero section visitors see first, and the stats row below it.</p>

                    <div className="mt-4 max-w-xs">
                      <label htmlFor="happy_travelers_count" className="text-xs font-medium text-foreground/60">Happy Travelers Count</label>
                      <input id="happy_travelers_count" name="happy_travelers_count" defaultValue={settings.happy_travelers_count} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>

                    <div className="mt-6 grid gap-4 border-t border-secondary/20 pt-6 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="heroBadgeText" className="text-xs font-medium text-foreground/60">Badge Text</label>
                        <p className="mt-0.5 text-[11px] text-foreground/40">Leave blank to hide the badge (and its decorative line) entirely.</p>
                        <input id="heroBadgeText" name="heroBadgeText" defaultValue={settings.heroBadgeText} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="heroHeadlineLine1" className="text-xs font-medium text-foreground/60">Headline, Line 1</label>
                        <input id="heroHeadlineLine1" name="heroHeadlineLine1" defaultValue={settings.heroHeadlineLine1} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="heroHeadlineLine2" className="text-xs font-medium text-foreground/60">Headline, Line 2 (italic)</label>
                        <input id="heroHeadlineLine2" name="heroHeadlineLine2" defaultValue={settings.heroHeadlineLine2} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="heroSubtitle" className="text-xs font-medium text-foreground/60">Subtitle</label>
                        <textarea id="heroSubtitle" name="heroSubtitle" rows={2} defaultValue={settings.heroSubtitle} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="heroCta1Label" className="text-xs font-medium text-foreground/60">Primary Button Label</label>
                        <input id="heroCta1Label" name="heroCta1Label" defaultValue={settings.heroCta1Label} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="heroCta1Href" className="text-xs font-medium text-foreground/60">Primary Button Link</label>
                        <input id="heroCta1Href" name="heroCta1Href" defaultValue={settings.heroCta1Href} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="heroCta2Label" className="text-xs font-medium text-foreground/60">Secondary Button Label</label>
                        <input id="heroCta2Label" name="heroCta2Label" defaultValue={settings.heroCta2Label} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="heroCta2Href" className="text-xs font-medium text-foreground/60">Secondary Button Link</label>
                        <input id="heroCta2Href" name="heroCta2Href" defaultValue={settings.heroCta2Href} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                  </section>

                  <HeroSlidesEditor
                    slides={heroSlides.map((s) => ({ mediaUrl: s.mediaUrl, altText: s.altText }))}
                    mediaItems={mediaItems}
                  />

                  <section className="card p-6">
                    <h2 className="font-heading text-lg font-semibold text-foreground">Trust Indicators</h2>
                    <p className="mt-1 text-xs text-foreground/50">The 4 highlight cards below the hero (icons are fixed).</p>

                    <div className="mt-4 grid gap-6 sm:grid-cols-2">
                      {([1, 2, 3, 4] as const).map((n) => (
                        <div key={n} className="space-y-2 rounded-2xl border border-secondary/20 p-4">
                          <div>
                            <label htmlFor={`trustIndicator${n}Title`} className="text-xs font-medium text-foreground/60">Card {n} Title</label>
                            <input
                              id={`trustIndicator${n}Title`}
                              name={`trustIndicator${n}Title`}
                              defaultValue={settings[`trustIndicator${n}Title` as const]}
                              className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label htmlFor={`trustIndicator${n}Desc`} className="text-xs font-medium text-foreground/60">Card {n} Description</label>
                            <input
                              id={`trustIndicator${n}Desc`}
                              name={`trustIndicator${n}Desc`}
                              defaultValue={settings[`trustIndicator${n}Desc` as const]}
                              className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="card p-6">
                    <h2 className="font-heading text-lg font-semibold text-foreground">Homepage Story (&ldquo;More Than Just a Trip&rdquo;)</h2>
                    <p className="mt-1 text-xs text-foreground/50">
                      The testimonial section below the hero. To change which review is quoted here, use the
                      &ldquo;Feature on Homepage&rdquo; button on the Reviews page.
                    </p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="whyChooseHeadlineLine1" className="text-xs font-medium text-foreground/60">Headline, Line 1</label>
                        <input id="whyChooseHeadlineLine1" name="whyChooseHeadlineLine1" defaultValue={settings.whyChooseHeadlineLine1} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="whyChooseHeadlineLine2" className="text-xs font-medium text-foreground/60">Headline, Line 2 (italic)</label>
                        <input id="whyChooseHeadlineLine2" name="whyChooseHeadlineLine2" defaultValue={settings.whyChooseHeadlineLine2} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="whyChooseDescription" className="text-xs font-medium text-foreground/60">Description</label>
                        <textarea id="whyChooseDescription" name="whyChooseDescription" rows={2} defaultValue={settings.whyChooseDescription} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div className="sm:col-span-2">
                        <SettingsImageField id="whyChooseImage" name="whyChooseImage" label="Image" defaultValue={settings.whyChooseImage} mediaItems={mediaItems} />
                      </div>
                      <div>
                        <label htmlFor="whyChooseChecklist1" className="text-xs font-medium text-foreground/60">Checklist Item 1</label>
                        <input id="whyChooseChecklist1" name="whyChooseChecklist1" defaultValue={settings.whyChooseChecklist1} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="whyChooseChecklist2" className="text-xs font-medium text-foreground/60">Checklist Item 2</label>
                        <input id="whyChooseChecklist2" name="whyChooseChecklist2" defaultValue={settings.whyChooseChecklist2} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="whyChooseChecklist3" className="text-xs font-medium text-foreground/60">Checklist Item 3</label>
                        <input id="whyChooseChecklist3" name="whyChooseChecklist3" defaultValue={settings.whyChooseChecklist3} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="whyChooseChecklist4" className="text-xs font-medium text-foreground/60">Checklist Item 4</label>
                        <input id="whyChooseChecklist4" name="whyChooseChecklist4" defaultValue={settings.whyChooseChecklist4} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="whyChooseCtaLabel" className="text-xs font-medium text-foreground/60">Button Label</label>
                        <input id="whyChooseCtaLabel" name="whyChooseCtaLabel" defaultValue={settings.whyChooseCtaLabel} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="whyChooseCtaHref" className="text-xs font-medium text-foreground/60">Button Link</label>
                        <input id="whyChooseCtaHref" name="whyChooseCtaHref" defaultValue={settings.whyChooseCtaHref} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                  </section>

                  <section className="card p-6">
                    <h2 className="font-heading text-lg font-semibold text-foreground">Explore Teyezilla (&ldquo;Seven Ways to Discover Africa&rdquo;)</h2>
                    <p className="mt-1 text-xs text-foreground/50">Description and image for each of the 7 category cards (labels and links are fixed).</p>

                    <div className="mt-4 grid gap-6 sm:grid-cols-2">
                      {(
                        [
                          ["Destinations", "categoryDestinationsDescription", "categoryDestinationsImage"],
                          ["Journeys", "categoryJourneysDescription", "categoryJourneysImage"],
                          ["Experiences", "categoryExperiencesDescription", "categoryExperiencesImage"],
                          ["Collections", "categoryCollectionsDescription", "categoryCollectionsImage"],
                          ["Safari", "categorySafariDescription", "categorySafariImage"],
                          ["Bespoke", "categoryBespokeDescription", "categoryBespokeImage"],
                          ["Journal", "categoryJournalDescription", "categoryJournalImage"],
                        ] as const
                      ).map(([label, descKey, imageKey]) => (
                        <div key={label} className="space-y-3 rounded-2xl border border-secondary/20 p-4">
                          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
                          <div>
                            <label htmlFor={descKey} className="text-xs font-medium text-foreground/60">Description</label>
                            <p className="mt-0.5 text-[11px] text-foreground/40">
                              Up to {CATEGORY_DESCRIPTION_MAX_LENGTH} characters -- the card only has room for so much before the text gets cut off.
                            </p>
                            <textarea
                              id={descKey}
                              name={descKey}
                              rows={2}
                              maxLength={CATEGORY_DESCRIPTION_MAX_LENGTH}
                              defaultValue={settings[descKey]}
                              className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <SettingsImageField id={imageKey} name={imageKey} label="Image" defaultValue={settings[imageKey]} mediaItems={mediaItems} />
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              ),
            },
            {
              id: "bespoke",
              label: "Bespoke Page",
              content: (
                <section className="card p-6">
                  <h2 className="font-heading text-lg font-semibold text-foreground">Bespoke Page (&ldquo;Your Journey, Your Way&rdquo;)</h2>
                  <p className="mt-1 text-xs text-foreground/50">The standalone /tailor-made-trips page linked from the &ldquo;Bespoke&rdquo; card and nav.</p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="bespokeEyebrow" className="text-xs font-medium text-foreground/60">Eyebrow Label</label>
                      <input id="bespokeEyebrow" name="bespokeEyebrow" defaultValue={settings.bespokeEyebrow} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label htmlFor="bespokeHeadline" className="text-xs font-medium text-foreground/60">Headline</label>
                      <input id="bespokeHeadline" name="bespokeHeadline" defaultValue={settings.bespokeHeadline} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="bespokeIntro" className="text-xs font-medium text-foreground/60">Intro Paragraph</label>
                      <textarea id="bespokeIntro" name="bespokeIntro" rows={3} defaultValue={settings.bespokeIntro} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label htmlFor="bespokeService1" className="text-xs font-medium text-foreground/60">Service 1</label>
                      <input id="bespokeService1" name="bespokeService1" defaultValue={settings.bespokeService1} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label htmlFor="bespokeService2" className="text-xs font-medium text-foreground/60">Service 2</label>
                      <input id="bespokeService2" name="bespokeService2" defaultValue={settings.bespokeService2} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label htmlFor="bespokeService3" className="text-xs font-medium text-foreground/60">Service 3</label>
                      <input id="bespokeService3" name="bespokeService3" defaultValue={settings.bespokeService3} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label htmlFor="bespokeService4" className="text-xs font-medium text-foreground/60">Service 4</label>
                      <input id="bespokeService4" name="bespokeService4" defaultValue={settings.bespokeService4} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <p className="text-[11px] text-foreground/40 sm:col-span-2">Leave a service blank to remove that bullet entirely.</p>
                    <div>
                      <label htmlFor="bespokeHowItWorksHeading" className="text-xs font-medium text-foreground/60">&ldquo;How It Works&rdquo; Heading</label>
                      <input id="bespokeHowItWorksHeading" name="bespokeHowItWorksHeading" defaultValue={settings.bespokeHowItWorksHeading} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label htmlFor="bespokeCtaLabel" className="text-xs font-medium text-foreground/60">Button Label</label>
                      <input id="bespokeCtaLabel" name="bespokeCtaLabel" defaultValue={settings.bespokeCtaLabel} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="bespokeHowItWorksBody" className="text-xs font-medium text-foreground/60">&ldquo;How It Works&rdquo; Body</label>
                      <p className="mt-0.5 text-[11px] text-foreground/40">
                        A fixed closing sentence linking to the Contact page is always appended after this text.
                      </p>
                      <textarea id="bespokeHowItWorksBody" name="bespokeHowItWorksBody" rows={4} defaultValue={settings.bespokeHowItWorksBody} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                </section>
              ),
            },
            {
              id: "hub-pages",
              label: "Hub Pages",
              content: (
                <>
                  <section className="card p-6">
                    <h2 className="font-heading text-lg font-semibold text-foreground">Experiences (/experiences)</h2>
                    <div className="mt-4 grid gap-4">
                      <div>
                        <label htmlFor="experiencesHeadline" className="text-xs font-medium text-foreground/60">Headline</label>
                        <input id="experiencesHeadline" name="experiencesHeadline" defaultValue={settings.experiencesHeadline} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="experiencesIntro1" className="text-xs font-medium text-foreground/60">Intro, Line 1</label>
                        <textarea id="experiencesIntro1" name="experiencesIntro1" rows={2} defaultValue={settings.experiencesIntro1} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="experiencesIntro2" className="text-xs font-medium text-foreground/60">Intro, Line 2 (longer SEO copy)</label>
                        <textarea id="experiencesIntro2" name="experiencesIntro2" rows={5} defaultValue={settings.experiencesIntro2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                  </section>

                  <section className="card p-6">
                    <h2 className="font-heading text-lg font-semibold text-foreground">Journeys (/journeys)</h2>
                    <div className="mt-4 grid gap-4">
                      <div>
                        <label htmlFor="journeysHeadline" className="text-xs font-medium text-foreground/60">Headline</label>
                        <input id="journeysHeadline" name="journeysHeadline" defaultValue={settings.journeysHeadline} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="journeysIntro" className="text-xs font-medium text-foreground/60">Intro</label>
                        <textarea id="journeysIntro" name="journeysIntro" rows={3} defaultValue={settings.journeysIntro} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                  </section>

                  <section className="card p-6">
                    <h2 className="font-heading text-lg font-semibold text-foreground">Collections (/collections)</h2>
                    <p className="mt-1 text-xs text-foreground/50">
                      The &ldquo;N curated ways to experience Africa&rdquo; line above this isn&rsquo;t editable here --
                      it&rsquo;s generated from the live collection count so it never goes stale.
                    </p>
                    <div className="mt-4 grid gap-4">
                      <div>
                        <label htmlFor="collectionsHeadline" className="text-xs font-medium text-foreground/60">Headline</label>
                        <input id="collectionsHeadline" name="collectionsHeadline" defaultValue={settings.collectionsHeadline} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="collectionsIntro" className="text-xs font-medium text-foreground/60">Intro (SEO copy)</label>
                        <textarea id="collectionsIntro" name="collectionsIntro" rows={4} defaultValue={settings.collectionsIntro} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                  </section>

                  <section className="card p-6">
                    <h2 className="font-heading text-lg font-semibold text-foreground">Safari (/safari)</h2>
                    <div className="mt-4 grid gap-4">
                      <div>
                        <label htmlFor="safariEyebrow" className="text-xs font-medium text-foreground/60">Eyebrow Label</label>
                        <input id="safariEyebrow" name="safariEyebrow" defaultValue={settings.safariEyebrow} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="safariHeadline" className="text-xs font-medium text-foreground/60">Headline</label>
                        <input id="safariHeadline" name="safariHeadline" defaultValue={settings.safariHeadline} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label htmlFor="safariIntro" className="text-xs font-medium text-foreground/60">Intro</label>
                        <textarea id="safariIntro" name="safariIntro" rows={3} defaultValue={settings.safariIntro} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                  </section>
                </>
              ),
            },
            {
              id: "legal",
              label: "Legal & Policies",
              content: (
                <section className="card p-6">
                  <h2 className="font-heading text-lg font-semibold text-foreground">Legal Pages</h2>
                  <p className="mt-1 text-xs text-foreground/50">
                    Shown on the Terms &amp; Conditions, Privacy Policy, and Cancellation Policy pages.
                  </p>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="termsContent" className="text-xs font-medium text-foreground/60">Terms &amp; Conditions</label>
                      <textarea id="termsContent" name="termsContent" rows={6} defaultValue={settings.termsContent} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label htmlFor="privacyPolicyContent" className="text-xs font-medium text-foreground/60">Privacy Policy</label>
                      <textarea id="privacyPolicyContent" name="privacyPolicyContent" rows={6} defaultValue={settings.privacyPolicyContent} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label htmlFor="cancellationPolicyContent" className="text-xs font-medium text-foreground/60">Cancellation Policy</label>
                      <p className="mt-0.5 text-[11px] text-foreground/40">
                        The general explainer on the standalone Cancellation Policy page -- specific per-package
                        terms are set on each tour/journey&rsquo;s own Cancellation &amp; Refund Policy field instead.
                      </p>
                      <textarea id="cancellationPolicyContent" name="cancellationPolicyContent" rows={6} defaultValue={settings.cancellationPolicyContent} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                </section>
              ),
            },
            {
              id: "seo",
              label: "SEO",
              content: (
                <section className="card p-6">
                  <h2 className="font-heading text-lg font-semibold text-foreground">SEO Defaults</h2>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="defaultMetaTitle" className="text-xs font-medium text-foreground/60">Default Meta Title</label>
                      <input id="defaultMetaTitle" name="defaultMetaTitle" defaultValue={settings.defaultMetaTitle} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label htmlFor="defaultMetaDescription" className="text-xs font-medium text-foreground/60">Default Meta Description</label>
                      <textarea id="defaultMetaDescription" name="defaultMetaDescription" rows={2} defaultValue={settings.defaultMetaDescription} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                </section>
              ),
            },
            {
              id: "loyalty",
              label: "Loyalty Programme",
              content: (
                <section className="card p-6">
                  <h2 className="font-heading text-lg font-semibold text-foreground">Loyalty Programme</h2>
                  <p className="mt-1 text-xs text-foreground/50">
                    Points customers earn per $10 of a booking&rsquo;s quoted total once staff mark it paid.
                    Redeeming points uses the same rate in reverse.
                  </p>
                  <div className="mt-4 max-w-xs">
                    <label htmlFor={LOYALTY_ACCRUAL_SETTING_KEY} className="text-xs font-medium text-foreground/60">Points per $10 spent</label>
                    <input
                      id={LOYALTY_ACCRUAL_SETTING_KEY}
                      name={LOYALTY_ACCRUAL_SETTING_KEY}
                      type="number"
                      min={0}
                      step="0.1"
                      defaultValue={settings[LOYALTY_ACCRUAL_SETTING_KEY]}
                      className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </section>
              ),
            },
            {
              id: "email",
              label: "Email Templates",
              content: (
                <section className="card p-6">
                  <h2 className="font-heading text-lg font-semibold text-foreground">Email Templates</h2>
                  <p className="mt-1 text-xs text-foreground/50">
                    Enquiry confirmations, quotes, and admin notifications are sent via Resend;
                    templates live in <code>lib/email-templates.ts</code>.
                  </p>
                </section>
              ),
            },
          ]}
        />
      </SettingsForm>
    </div>
  );
}
