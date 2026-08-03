"use client";

import { useState } from "react";
import Image from "next/image";
import type { MediaItem } from "@/lib/admin/data/media";

// Pairs a plain URL input (for pasting an external/CDN link directly) with
// a "Browse" button that opens the real Media Library as a picker modal --
// previously every form's "Open Media Library" button just navigated away
// to /admin/media in the same tab, a dead end with no way to bring a
// selected image back into the field it was meant for.
export default function MediaPickerField({
  id,
  name,
  label,
  value,
  onChange,
  mediaItems,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  mediaItems: MediaItem[];
}) {
  const [open, setOpen] = useState(false);
  const images = mediaItems.filter((m) => m.fileType === "image");

  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-foreground/60">{label}</label>
      <div className="mt-1 flex gap-2">
        <input
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button type="button" onClick={() => setOpen(true)} className="btn-outline shrink-0 whitespace-nowrap text-sm">
          Browse Library
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-foreground">Select an Image</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-foreground/50 hover:text-foreground">
                ✕
              </button>
            </div>
            {images.length === 0 ? (
              <p className="mt-4 text-sm text-foreground/50">
                No images in the Media Library yet. Upload one in{" "}
                <a href="/admin/media" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Media Library
                </a>{" "}
                (opens in a new tab), then reopen this picker.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.fileUrl);
                      setOpen(false);
                    }}
                    className={`relative h-28 overflow-hidden rounded-xl border-2 transition-colors ${
                      item.fileUrl === value ? "border-primary" : "border-transparent hover:border-secondary/50"
                    }`}
                  >
                    <Image src={item.fileUrl} alt={item.altText} fill sizes="200px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
