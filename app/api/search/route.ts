import { NextRequest, NextResponse } from "next/server";
import { getSupabasePublicClient } from "@/lib/supabase/public";

export interface SearchResultItem {
  label: string;
  sublabel?: string;
  href: string;
}

export interface SearchResultGroup {
  category: string;
  items: SearchResultItem[];
}

const PER_CATEGORY_LIMIT = 4;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ query: q, groups: [] });
  }

  const supabase = getSupabasePublicClient();
  if (!supabase) {
    return NextResponse.json({ query: q, groups: [] });
  }

  const pattern = `%${q}%`;

  const [destinations, journeys, tours, collections, safariThemes, blogPosts] = await Promise.all([
    supabase
      .from("destinations")
      .select("country_name, slug")
      .ilike("country_name", pattern)
      .limit(PER_CATEGORY_LIMIT),
    supabase
      .from("journeys")
      .select("title, slug, short_description")
      .ilike("title", pattern)
      .limit(PER_CATEGORY_LIMIT),
    supabase
      .from("tours")
      .select("title, slug, category_label")
      .eq("status", "published")
      .ilike("title", pattern)
      .limit(PER_CATEGORY_LIMIT),
    supabase
      .from("collections")
      .select("name, slug")
      .ilike("name", pattern)
      .limit(PER_CATEGORY_LIMIT),
    supabase
      .from("safari_themes")
      .select("name, slug")
      .ilike("name", pattern)
      .limit(PER_CATEGORY_LIMIT),
    supabase
      .from("blog_posts")
      .select("title, slug, category")
      .eq("status", "published")
      .ilike("title", pattern)
      .limit(PER_CATEGORY_LIMIT),
  ]);

  const groups: SearchResultGroup[] = [];

  if (destinations.data?.length) {
    groups.push({
      category: "Destinations",
      items: destinations.data.map((d) => ({ label: d.country_name, href: `/destinations/${d.slug}` })),
    });
  }
  if (journeys.data?.length) {
    groups.push({
      category: "Journeys",
      items: journeys.data.map((j) => ({
        label: j.title,
        sublabel: j.short_description ?? undefined,
        href: `/journeys/${j.slug}`,
      })),
    });
  }
  if (tours.data?.length) {
    groups.push({
      category: "Experiences",
      items: tours.data.map((t) => ({
        label: t.title,
        sublabel: t.category_label ?? undefined,
        href: `/tours/${t.slug}`,
      })),
    });
  }
  if (collections.data?.length) {
    groups.push({
      category: "Collections",
      items: collections.data.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })),
    });
  }
  if (safariThemes.data?.length) {
    groups.push({
      category: "Safari",
      items: safariThemes.data.map((s) => ({ label: s.name, href: `/safari?theme=${s.slug}#signature-safari` })),
    });
  }
  if (blogPosts.data?.length) {
    groups.push({
      category: "Journal",
      items: blogPosts.data.map((b) => ({
        label: b.title,
        sublabel: b.category ?? undefined,
        href: `/blog/${b.slug}`,
      })),
    });
  }

  return NextResponse.json({ query: q, groups });
}
