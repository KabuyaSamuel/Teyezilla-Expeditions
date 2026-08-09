"use client";

import { useState } from "react";
import Image from "next/image";
import { Video } from "lucide-react";
import type { MediaItem } from "@/lib/admin/data/media";
import { updateHeroSlides, type HeroSlideInput } from "@/lib/admin/actions/hero";
import { SortableList, SortableItem, arrayMoveIndex } from "./SortableList";
import { useToast } from "./Toast";
import InlineMediaUpload from "./InlineMediaUpload";

function SlideMediaPicker({
  value,
  onChange,
  mediaItems,
}: {
  value: string;
  onChange: (url: string) => void;
  mediaItems: MediaItem[];
}) {
  const [open, setOpen] = useState(false);
  const options = mediaItems.filter((m) => m.fileType === "image" || m.fileType === "video");

  return (
    <div className="mt-2 flex gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://... (image or video URL)"
        className="w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button type="button" onClick={() => setOpen(true)} className="btn-outline shrink-0 whitespace-nowrap text-sm">
        Browse Library
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-foreground">Select Media</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-foreground/50 hover:text-foreground">
                ✕
              </button>
            </div>

            <div className="mt-4">
              <InlineMediaUpload
                accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                onUploaded={(url) => {
                  onChange(url);
                  setOpen(false);
                }}
              />
              <p className="mt-1 text-[11px] text-foreground/40">Keep video clips short and compressed to stay well under the limit.</p>
            </div>

            {options.length === 0 ? (
              <p className="mt-4 text-sm text-foreground/50">
                No images or videos in the Media Library yet -- upload one above.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {options.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.fileUrl);
                      setOpen(false);
                    }}
                    className={`relative flex h-28 items-center justify-center overflow-hidden rounded-xl border-2 bg-secondary/10 transition-colors ${
                      item.fileUrl === value ? "border-primary" : "border-transparent hover:border-secondary/50"
                    }`}
                  >
                    {item.fileType === "image" ? (
                      <Image src={item.fileUrl} alt={item.altText} fill sizes="200px" className="object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 px-2 text-foreground/60">
                        <Video className="h-6 w-6" />
                        <span className="line-clamp-2 text-center text-[11px]">{item.altText || "Video"}</span>
                      </div>
                    )}
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

export default function HeroSlidesEditor({
  slides: initialSlides,
  mediaItems,
}: {
  slides: HeroSlideInput[];
  mediaItems: MediaItem[];
}) {
  const { toast } = useToast();
  const [slides, setSlides] = useState<HeroSlideInput[]>(initialSlides);
  const [ids, setIds] = useState<string[]>(() => initialSlides.map(() => crypto.randomUUID()));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(index: number, field: keyof HeroSlideInput, value: string) {
    setSlides((s) => s.map((slide, i) => (i === index ? { ...slide, [field]: value } : slide)));
    setSaved(false);
  }
  function add() {
    setSlides((s) => [...s, { mediaUrl: "", altText: "" }]);
    setIds((prev) => [...prev, crypto.randomUUID()]);
    setSaved(false);
  }
  function remove(index: number) {
    setSlides((s) => s.filter((_, i) => i !== index));
    setIds((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  }
  function reorder(oldIndex: number, newIndex: number) {
    setSlides((s) => arrayMoveIndex(s, oldIndex, newIndex));
    setIds((prev) => arrayMoveIndex(prev, oldIndex, newIndex));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await updateHeroSlides(slides);
      setSaved(true);
      toast.success("Hero slides saved.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save hero slides.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">Hero Background Slides</h2>
          <p className="mt-1 text-xs text-foreground/50">
            The rotating video/image background on the homepage hero. Leave empty to use the default
            placeholder footage.
          </p>
        </div>
        <button type="button" onClick={add} className="text-sm font-medium text-primary hover:underline">
          + Add Slide
        </button>
      </div>

      <SortableList ids={ids} onReorder={reorder}>
        <div className="mt-4 space-y-3">
          {slides.map((slide, i) => (
            <SortableItem key={ids[i]} id={ids[i]}>
              <div className="rounded-xl bg-secondary/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Slide {i + 1}</p>
                  <button type="button" onClick={() => remove(i)} className="text-xs font-medium text-error hover:underline">
                    Remove
                  </button>
                </div>
                <SlideMediaPicker
                  value={slide.mediaUrl}
                  onChange={(url) => update(i, "mediaUrl", url)}
                  mediaItems={mediaItems}
                />
                <input
                  value={slide.altText}
                  onChange={(e) => update(i, "altText", e.target.value)}
                  placeholder="Alt text (describes the scene, for accessibility)"
                  className="mt-2 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableList>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      <button type="button" onClick={handleSave} disabled={saving} className="btn-primary mt-4 text-sm disabled:opacity-50">
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save Hero Slides"}
      </button>
    </section>
  );
}
