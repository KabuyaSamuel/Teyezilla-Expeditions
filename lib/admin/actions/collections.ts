"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";
import { redirectWithSaved } from "./saved-redirect";

export interface CollectionInput {
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  status: string;
  tourIds: string[];
  journeyIds: string[];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toRow(input: CollectionInput) {
  return {
    name: input.name,
    slug: input.slug || slugify(input.name),
    description: input.description,
    hero_image: input.heroImage,
    status: input.status,
  };
}

async function syncCollectionRelations(
  supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>,
  collectionId: string,
  input: CollectionInput
) {
  if (!supabase) return;

  await Promise.all([
    (async () => {
      const { error: deleteError } = await supabase.from("collection_tours").delete().eq("collection_id", collectionId);
      if (deleteError) throw new Error(deleteError.message);
      if (input.tourIds.length === 0) return;

      const { error } = await supabase.from("collection_tours").insert(
        input.tourIds.map((tourId, index) => ({ collection_id: collectionId, tour_id: tourId, display_order: index }))
      );
      if (error) throw new Error(error.message);
    })(),

    (async () => {
      const { error: deleteError } = await supabase.from("collection_journeys").delete().eq("collection_id", collectionId);
      if (deleteError) throw new Error(deleteError.message);
      if (input.journeyIds.length === 0) return;

      const { error } = await supabase.from("collection_journeys").insert(
        input.journeyIds.map((journeyId, index) => ({
          collection_id: collectionId,
          journey_id: journeyId,
          display_order: index,
        }))
      );
      if (error) throw new Error(error.message);
    })(),
  ]);
}

export async function createCollection(input: CollectionInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { data, error } = await supabase.from("collections").insert(toRow(input)).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "Failed to create collection.");

  await syncCollectionRelations(supabase, data.id, input);

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  revalidatePublicSite();
  redirectWithSaved("/admin/collections", `"${input.name}" created.`);
}

export async function updateCollection(id: string, input: CollectionInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("collections").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  await syncCollectionRelations(supabase, id, input);

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  revalidatePublicSite();
  redirectWithSaved("/admin/collections", `"${input.name}" saved.`);
}

export async function deleteCollection(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  // collection_tours / collection_journeys reference collection_id on delete cascade.
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  revalidatePublicSite();
  redirectWithSaved("/admin/collections", "Collection deleted.");
}
