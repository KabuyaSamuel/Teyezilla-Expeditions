// mapProductScalars' important_info/cancellation_policy fields went from
// a plain text column to text[] in migration 20260809120000. toStringArray
// (lib/productShared.ts) exists specifically so this code can ship before
// that migration has actually run against a given database -- a plain
// string value must still read as legacy data instead of crashing
// downstream .map() calls (ProductGoodToKnow, the tour/journey detail
// pages). Pure function, no live services needed.

import { describe, it, expect } from "vitest";
import { mapProductScalars } from "@/lib/productShared";

describe("mapProductScalars important_info/cancellation_policy", () => {
  it("reads a pre-migration plain string as a single-item array", () => {
    const scalars = mapProductScalars({
      important_info: "Bring a valid passport.",
      cancellation_policy: "Full refund up to 30 days before departure.",
    });
    expect(scalars.importantInfo).toEqual(["Bring a valid passport."]);
    expect(scalars.cancellationPolicy).toEqual(["Full refund up to 30 days before departure."]);
  });

  it("passes a post-migration array through unchanged", () => {
    const scalars = mapProductScalars({
      important_info: ["Bring a valid passport.", "Malaria prophylaxis recommended."],
      cancellation_policy: ["Full refund up to 30 days before departure.", "50% refund within 14 days."],
    });
    expect(scalars.importantInfo).toEqual(["Bring a valid passport.", "Malaria prophylaxis recommended."]);
    expect(scalars.cancellationPolicy).toEqual(["Full refund up to 30 days before departure.", "50% refund within 14 days."]);
  });

  it("defaults null/undefined/empty-string to an empty array rather than crashing", () => {
    expect(mapProductScalars({ important_info: null, cancellation_policy: undefined }).importantInfo).toEqual([]);
    expect(mapProductScalars({ important_info: "", cancellation_policy: "" }).cancellationPolicy).toEqual([]);
    expect(mapProductScalars({}).importantInfo).toEqual([]);
  });
});
