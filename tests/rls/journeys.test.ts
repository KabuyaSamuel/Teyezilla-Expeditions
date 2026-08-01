import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { anonClient, serviceClient } from "./helpers";

describe("journeys RLS", () => {
  let draftJourneyId: string;
  let publishedJourneyId: string;

  beforeAll(async () => {
    const service = serviceClient();

    const { data: draft, error: draftError } = await service
      .from("journeys")
      .insert({ title: "__rls_test_draft_journey__", slug: `__rls_test_draft_journey__${Date.now()}`, status: "draft" })
      .select("id")
      .single();
    if (draftError || !draft) throw new Error(`Failed to create draft test journey: ${draftError?.message}`);
    draftJourneyId = draft.id;

    const { data: published, error: publishedError } = await service
      .from("journeys")
      .insert({
        title: "__rls_test_published_journey__",
        slug: `__rls_test_published_journey__${Date.now()}`,
        status: "published",
      })
      .select("id")
      .single();
    if (publishedError || !published) throw new Error(`Failed to create published test journey: ${publishedError?.message}`);
    publishedJourneyId = published.id;
  });

  afterAll(async () => {
    const service = serviceClient();
    await service.from("journeys").delete().in("id", [draftJourneyId, publishedJourneyId]);
  });

  it("hides draft journeys from the anon client", async () => {
    const { data } = await anonClient().from("journeys").select("id").eq("id", draftJourneyId).maybeSingle();
    expect(data).toBeNull();
  });

  it("exposes published journeys to the anon client", async () => {
    const { data } = await anonClient().from("journeys").select("id").eq("id", publishedJourneyId).maybeSingle();
    expect(data?.id).toBe(publishedJourneyId);
  });
});
