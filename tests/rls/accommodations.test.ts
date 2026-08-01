// The accommodations table existed before this session but had no admin
// CRUD wired up; this checks the draft/published RLS pattern it already
// had actually behaves as expected now that it's reachable from the admin.

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { anonClient, serviceClient, anyDestinationId } from "./helpers";

describe("accommodations RLS", () => {
  let draftId: string;
  let publishedId: string;

  beforeAll(async () => {
    const destinationId = await anyDestinationId();
    const service = serviceClient();

    const { data: draft, error: draftError } = await service
      .from("accommodations")
      .insert({ destination_id: destinationId, name: "__rls_test_draft_accommodation__", status: "draft" })
      .select("id")
      .single();
    if (draftError || !draft) throw new Error(`Failed to create draft test accommodation: ${draftError?.message}`);
    draftId = draft.id;

    const { data: published, error: publishedError } = await service
      .from("accommodations")
      .insert({ destination_id: destinationId, name: "__rls_test_published_accommodation__", status: "published" })
      .select("id")
      .single();
    if (publishedError || !published) throw new Error(`Failed to create published test accommodation: ${publishedError?.message}`);
    publishedId = published.id;
  });

  afterAll(async () => {
    const service = serviceClient();
    await service.from("accommodations").delete().in("id", [draftId, publishedId]);
  });

  it("hides draft accommodations from the anon client", async () => {
    const { data } = await anonClient().from("accommodations").select("id").eq("id", draftId).maybeSingle();
    expect(data).toBeNull();
  });

  it("exposes published accommodations to the anon client", async () => {
    const { data } = await anonClient().from("accommodations").select("id").eq("id", publishedId).maybeSingle();
    expect(data?.id).toBe(publishedId);
  });
});
