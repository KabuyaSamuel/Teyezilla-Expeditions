// Regression test for the exact bug fixed in 596ad62: the admin Tour
// Management list was reading through the anon client, whose RLS only
// returns status='published' rows, so newly-created draft tours were
// invisible. This locks in the underlying RLS behavior both sides of that
// fix depend on.

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { anonClient, serviceClient, anyDestinationId } from "./helpers";

describe("tours RLS", () => {
  let draftTourId: string;
  let publishedTourId: string;

  beforeAll(async () => {
    const destinationId = await anyDestinationId();
    const service = serviceClient();

    const { data: draft, error: draftError } = await service
      .from("tours")
      .insert({
        title: "__rls_test_draft_tour__",
        slug: `__rls_test_draft_tour__${Date.now()}`,
        destination_id: destinationId,
        status: "draft",
      })
      .select("id")
      .single();
    if (draftError || !draft) throw new Error(`Failed to create draft test tour: ${draftError?.message}`);
    draftTourId = draft.id;

    const { data: published, error: publishedError } = await service
      .from("tours")
      .insert({
        title: "__rls_test_published_tour__",
        slug: `__rls_test_published_tour__${Date.now()}`,
        destination_id: destinationId,
        status: "published",
        hero_image: "https://picsum.photos/seed/rls-test/1200/800",
        short_description: "RLS test fixture.",
      })
      .select("id")
      .single();
    if (publishedError || !published) throw new Error(`Failed to create published test tour: ${publishedError?.message}`);
    publishedTourId = published.id;
  });

  afterAll(async () => {
    const service = serviceClient();
    await service.from("tours").delete().in("id", [draftTourId, publishedTourId]);
  });

  it("hides draft tours from the anon client", async () => {
    const { data } = await anonClient().from("tours").select("id").eq("id", draftTourId).maybeSingle();
    expect(data).toBeNull();
  });

  it("exposes published tours to the anon client", async () => {
    const { data } = await anonClient().from("tours").select("id").eq("id", publishedTourId).maybeSingle();
    expect(data?.id).toBe(publishedTourId);
  });

  it("exposes both draft and published tours to the service-role client (what the admin list must use)", async () => {
    const { data } = await serviceClient().from("tours").select("id").in("id", [draftTourId, publishedTourId]);
    expect(data?.map((r) => r.id).sort()).toEqual([draftTourId, publishedTourId].sort());
  });
});
