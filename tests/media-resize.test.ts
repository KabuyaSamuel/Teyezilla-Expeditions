// Regression coverage for the upload-time resize added alongside the
// sharp dependency: a DSLR-sized original should never reach storage at
// full resolution, but small images, SVGs, GIFs, and corrupt uploads all
// need to survive untouched (or degrade gracefully) rather than block an
// admin's upload. Pure function, no live services -- unlike tests/rls/*,
// this never touches Supabase.

import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { resizeImageIfNeeded } from "@/lib/admin/actions/media";
import { MAX_IMAGE_EDGE_PX } from "@/lib/mediaLimits";

async function makeJpeg(width: number, height: number): Promise<Buffer> {
  return sharp({ create: { width, height, channels: 3, background: { r: 90, g: 140, b: 100 } } })
    .jpeg({ quality: 95 })
    .toBuffer();
}

describe("resizeImageIfNeeded", () => {
  it("caps a DSLR-sized image to MAX_IMAGE_EDGE_PX on its longest edge, preserving aspect ratio", async () => {
    const original = await makeJpeg(4000, 3000);
    const { buffer } = await resizeImageIfNeeded(original, "image/jpeg");
    const meta = await sharp(buffer).metadata();
    expect(meta.width).toBe(MAX_IMAGE_EDGE_PX);
    expect(meta.height).toBe(Math.round((MAX_IMAGE_EDGE_PX * 3000) / 4000));
  });

  it("does not upscale an image already smaller than MAX_IMAGE_EDGE_PX", async () => {
    const original = await makeJpeg(800, 600);
    const { buffer } = await resizeImageIfNeeded(original, "image/jpeg");
    const meta = await sharp(buffer).metadata();
    expect(meta.width).toBe(800);
    expect(meta.height).toBe(600);
  });

  it("passes SVGs through untouched", async () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>');
    const { buffer, contentType } = await resizeImageIfNeeded(svg, "image/svg+xml");
    expect(buffer).toEqual(svg);
    expect(contentType).toBe("image/svg+xml");
  });

  it("passes GIFs through untouched (avoids dropping animation frames)", async () => {
    const gif = await sharp({ create: { width: 4000, height: 3000, channels: 3, background: "#000" } })
      .gif()
      .toBuffer();
    const { buffer } = await resizeImageIfNeeded(gif, "image/gif");
    expect(buffer).toEqual(gif);
  });

  it("falls back to the original buffer when sharp can't decode the file", async () => {
    const garbage = Buffer.from("not a real image");
    const { buffer, contentType } = await resizeImageIfNeeded(garbage, "image/jpeg");
    expect(buffer).toEqual(garbage);
    expect(contentType).toBe("image/jpeg");
  });
});
