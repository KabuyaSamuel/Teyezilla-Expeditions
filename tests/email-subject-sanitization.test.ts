// Security audit (Part 2): contact/trip-planner actions interpolate raw
// user input into email subject lines sent via Resend. Verifies the
// defense-in-depth sanitizer strips newlines/control characters and caps
// length before that happens -- doesn't depend on Resend's own handling.
// Pure function, no live services -- can't submit the real form here (this
// audit pass is static/local analysis only, no live data writes or real
// emails), so this is the safe way to verify the exact behavior.

import { describe, it, expect } from "vitest";
import { sanitizeForEmailSubject } from "@/lib/enquiry-shared";

describe("sanitizeForEmailSubject", () => {
  it("strips embedded newlines and carriage returns", () => {
    const result = sanitizeForEmailSubject("John\r\nBcc: attacker@evil.com");
    expect(result).not.toMatch(/[\r\n]/);
    expect(result).toBe("John Bcc: attacker@evil.com");
  });

  it("strips other control characters", () => {
    const result = sanitizeForEmailSubject("John\x00\x07Doe");
    expect(result).toBe("John Doe");
  });

  it("truncates values longer than maxLength with an ellipsis", () => {
    const long = "A".repeat(200);
    const result = sanitizeForEmailSubject(long, 80);
    expect(result.length).toBe(80);
    expect(result.endsWith("…")).toBe(true);
  });

  it("leaves an ordinary name unchanged", () => {
    expect(sanitizeForEmailSubject("Jane Wanjiru")).toBe("Jane Wanjiru");
  });
});
