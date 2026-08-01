// Sanity/contrast check: activities has no draft/published concept and is
// unconditionally public. If this ever started failing, it'd mean the anon
// key itself is misconfigured or RLS got enabled without any policy at
// all -- a much bigger problem than the other tests in this suite would
// individually reveal.

import { describe, it, expect } from "vitest";
import { anonClient } from "./helpers";

describe("activities RLS", () => {
  it("is readable by the anon client", async () => {
    const { data, error } = await anonClient().from("activities").select("id").limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});
