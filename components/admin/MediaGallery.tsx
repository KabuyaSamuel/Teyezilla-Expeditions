"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Badge from "./Badge";
import MediaDeleteButton from "./MediaDeleteButton";
import { renameMedia } from "@/lib/admin/actions/media";
import type { MediaItem } from "@/lib/admin/data/media";
import { useToast } from "./Toast";

const TYPE_ICON: Record<MediaItem["fileType"], string> = { image: "🖼️", video: "🎬", pdf: "📄" };

export default function MediaGallery({ items }: { items: MediaItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i !== null && i < items.length - 1 ? i + 1 : i));
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, items.length]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <div key={item.id} className="card overflow-hidden">
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="block h-36 w-full cursor-zoom-in"
              aria-label={`View ${item.altText || "file"} full size`}
            >
              {item.fileType === "image" ? (
                <div className="relative h-36 w-full">
                  <Image
                    src={item.fileUrl}
                    alt={item.altText}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-36 w-full items-center justify-center bg-secondary/15 text-3xl">
                  {TYPE_ICON[item.fileType]}
                </div>
              )}
            </button>
            <div className="p-3">
              <MediaNameEditor item={item} />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-1">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <Badge key={tag} tone="neutral">{tag}</Badge>
                  ))}
                </div>
                <MediaDeleteButton id={item.id} fileUrl={item.fileUrl} storagePath={item.storagePath} />
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-foreground/50">No media yet.</p>}
      </div>

      {lightboxIndex !== null && items[lightboxIndex] && (
        <Lightbox
          item={items[lightboxIndex]}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < items.length - 1}
          onPrev={() => setLightboxIndex((i) => (i !== null ? i - 1 : i))}
          onNext={() => setLightboxIndex((i) => (i !== null ? i + 1 : i))}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

function Lightbox({
  item,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onClose,
}: {
  item: MediaItem;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        ✕
      </button>

      {hasPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
        >
          ←
        </button>
      )}
      {hasNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
        >
          →
        </button>
      )}

      <div className="max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        {item.fileType === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element -- unknown, unoptimized natural dimensions; next/image needs a fixed box that doesn't fit a "however big the file actually is" lightbox.
          <img src={item.fileUrl} alt={item.altText} className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain" />
        ) : item.fileType === "video" ? (
          <video src={item.fileUrl} controls autoPlay className="max-h-[85vh] max-w-[90vw] rounded-lg" />
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-10">
            <span className="text-5xl">📄</span>
            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
              Open PDF in new tab
            </a>
          </div>
        )}
        {item.altText && <p className="mt-3 text-center text-sm text-white/80">{item.altText}</p>}
      </div>
    </div>
  );
}

function MediaNameEditor({ item }: { item: MediaItem }) {
  const { toast } = useToast();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.altText);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (value.trim() === item.altText.trim()) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await renameMedia(item.id, value);
      setEditing(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to rename file.");
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={value}
        disabled={saving}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") {
            setValue(item.altText);
            setEditing(false);
          }
        }}
        className="w-full rounded-full border border-secondary/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title="Click to rename"
      className="block w-full truncate text-left text-xs font-medium text-foreground hover:underline"
    >
      {item.altText || "Untitled"}
    </button>
  );
}
