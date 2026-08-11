// Security audit (Part 3): uploadMedia() previously trusted the
// client-declared File.type outright, with no allowlist and no check that
// the bytes actually matched. Every check below throws before uploadMedia
// ever calls getSupabaseServerClient()/Supabase Storage -- confirmed by
// reading the source order in lib/admin/actions/media.ts -- so these are
// safe to run directly against the real function without a live service
// or any data write, matching this audit's static/local-only constraint.
// Can't submit the actual admin upload form here for the same reason
// (would require a live authenticated session); this exercises the exact
// same validation code path the form's server action calls.

import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { uploadMedia } from "@/lib/admin/actions/media";

function formDataWithFile(bytes: Buffer | string, filename: string, claimedType: string): FormData {
  const fd = new FormData();
  const part = typeof bytes === "string" ? bytes : new Uint8Array(bytes);
  fd.set("file", new File([part], filename, { type: claimedType }));
  return fd;
}

describe("uploadMedia validation (rejection paths)", () => {
  it("rejects a disallowed claimed type outright (e.g. a renamed .html file)", async () => {
    const html = "<html><body><script>alert(1)</script></body></html>";
    const fd = formDataWithFile(html, "evil.png", "text/html");
    await expect(uploadMedia(fd)).rejects.toThrow(/isn't allowed/);
  });

  it("rejects SVG uploads outright (stored-XSS vector via embedded <script>)", async () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(document.cookie)</script></svg>';
    const fd = formDataWithFile(svg, "logo.svg", "image/svg+xml");
    await expect(uploadMedia(fd)).rejects.toThrow(/isn't allowed/);
  });

  it("rejects a file whose actual bytes don't match its claimed type", async () => {
    // Real JPEG bytes, relabeled as PNG -- simulates a spoofed Content-Type
    // rather than a real browser-sniffed one.
    const realJpeg = await sharp({ create: { width: 10, height: 10, channels: 3, background: "#fff" } })
      .jpeg()
      .toBuffer();
    const fd = formDataWithFile(realJpeg, "fake.png", "image/png");
    await expect(uploadMedia(fd)).rejects.toThrow(/don't match its declared type/);
  });

  it("rejects a claimed image type with no detectable signature at all (plain text/garbage)", async () => {
    const fd = formDataWithFile("just plain text, not an image", "note.png", "image/png");
    await expect(uploadMedia(fd)).rejects.toThrow(/don't match its declared type/);
  });

  it("rejects an empty file before any type check", async () => {
    const fd = new FormData();
    fd.set("file", new File([], "empty.png", { type: "image/png" }));
    await expect(uploadMedia(fd)).rejects.toThrow(/Choose a file/);
  });
});
