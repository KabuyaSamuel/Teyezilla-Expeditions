import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

const POSTS: Record<
  string,
  { title: string; metaDescription: string; answer: string; body: string; author: string }
> = {
  "best-safari-in-kenya": {
    title: "Best Safari in Kenya",
    metaDescription:
      "The best Kenya safari for first-time visitors combines the Maasai Mara with a short Amboseli extension.",
    answer:
      "The best safari in Kenya for most first-time visitors is a 4 to 5 day Maasai Mara safari, ideally timed for the July to October wildebeest migration.",
    body: "Kenya's Maasai Mara is the country's flagship reserve, known for consistent big-five sightings and, from July to October, the great wildebeest migration crossing the Mara River. Pairing it with a 1-2 day Amboseli extension adds close-up elephant viewing with Kilimanjaro as a backdrop.",
    author: "Teyezilla Travel Team",
  },
  "kenya-vs-tanzania-safari": {
    title: "Kenya vs Tanzania Safari",
    metaDescription:
      "Kenya and Tanzania both offer world-class safaris; here's how the Maasai Mara compares to the Serengeti and Ngorongoro Crater.",
    answer:
      "Kenya's Maasai Mara offers easier access and shorter flights from Nairobi, while Tanzania's Serengeti and Ngorongoro Crater cover a larger, more remote wilderness across a longer trip.",
    body: "Choosing between Kenya and Tanzania often comes down to time and budget. Kenya's Maasai Mara sits close to Nairobi, making it ideal for shorter trips. Tanzania's Serengeti and Ngorongoro Crater require more travel time between parks but reward visitors with a wider, less crowded range of terrain and wildlife density.",
    author: "Teyezilla Travel Team",
  },
  "best-time-to-visit-zanzibar": {
    title: "Best Time to Visit Zanzibar",
    metaDescription:
      "The best time to visit Zanzibar is June to October or December to February, avoiding the April-May long rains.",
    answer:
      "The best time to visit Zanzibar is June to October, the dry season, or December to February, a warmer secondary dry window.",
    body: "Zanzibar has two dry seasons: June to October and December to February. The long rains fall from March to May and are worth avoiding for a beach-focused trip, though prices and crowds are both lower during that window for travelers with flexibility.",
    author: "Teyezilla Travel Team",
  },
  "egypt-travel-guide": {
    title: "Egypt Travel Guide",
    metaDescription:
      "Plan an Egypt trip covering the Pyramids of Giza, a Nile cruise, and Luxor's temples.",
    answer:
      "A first Egypt trip typically covers 3 days in Cairo for the Pyramids and museums, followed by a 3 to 4 day Nile cruise between Luxor and Aswan.",
    body: "Cairo anchors most Egypt itineraries with the Pyramids of Giza, the Sphinx, and the Egyptian Museum. From there, a Nile cruise connects Luxor's Valley of the Kings and Karnak Temple with Aswan's Philae Temple and Nubian villages.",
    author: "Teyezilla Travel Team",
  },
  "morocco-travel-guide": {
    title: "Morocco Travel Guide",
    metaDescription:
      "Plan a Morocco trip through Marrakech, Chefchaouen, and an overnight Sahara desert camp.",
    answer:
      "A classic Morocco itinerary runs Marrakech to Chefchaouen to a Sahara desert camp over 5 to 7 days.",
    body: "Marrakech's medina and souks are the natural starting point for a Morocco trip. From there, travelers head north to the blue-washed streets of Chefchaouen, or east toward Merzouga for an overnight Sahara desert camp under the stars.",
    author: "Teyezilla Travel Team",
  },
  "africa-travel-tips": {
    title: "Africa Travel Tips",
    metaDescription:
      "Practical tips for first-time Africa travelers: visas, vaccinations, packing, and safari etiquette.",
    answer:
      "Most Africa trips require an eVisa arranged in advance, standard travel vaccinations plus yellow fever in some countries, and neutral-colored clothing for safari game drives.",
    body: "Before an African trip, check eVisa requirements for each country on the itinerary, confirm any required vaccinations with a travel clinic, and pack neutral-colored, breathable clothing for safari days. A good pair of binoculars and a dust-resistant camera bag go a long way on game drives.",
    author: "Teyezilla Travel Team",
  },
};

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    author: { "@type": "Person", name: post.author },
    description: post.metaDescription,
  };

  return (
    <article className="section max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <h1 className="font-heading text-4xl font-bold text-foreground">{post.title}</h1>
      <p className="mt-2 text-sm text-foreground/60">By {post.author}</p>

      {/* Answer-first block for AEO/GEO */}
      <p className="mt-6 rounded-2xl bg-secondary/15 p-5 text-lg font-medium text-foreground">
        {post.answer}
      </p>

      <p className="mt-6 text-foreground/80">{post.body}</p>
    </article>
  );
}
