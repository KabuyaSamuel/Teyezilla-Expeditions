import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import MediaUploadForm from "@/components/admin/MediaUploadForm";
import MediaGallery from "@/components/admin/MediaGallery";
import Pagination from "@/components/admin/Pagination";
import { getMediaItemsPaginated, type MediaItem } from "@/lib/admin/data/media";
import { MEDIA_LIBRARY_PAGE_SIZE, parsePage } from "@/lib/admin/list-query";

const TYPE_FILTERS: { value: MediaItem["fileType"] | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "image", label: "🖼️ Images" },
  { value: "video", label: "🎬 Videos" },
  { value: "pdf", label: "📄 PDFs" },
];

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parsePage(params);
  const rawType = Array.isArray(params.type) ? params.type[0] : params.type;
  const fileType = rawType === "image" || rawType === "video" || rawType === "pdf" ? rawType : undefined;

  const { items: mediaItems, total } = await getMediaItemsPaginated({
    page,
    pageSize: MEDIA_LIBRARY_PAGE_SIZE,
    fileType,
  });

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Images, videos, PDFs, and travel guide brochures."
        action={<MediaUploadForm />}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => {
          const active = fileType === f.value;
          const href = f.value ? `/admin/media?type=${f.value}` : "/admin/media";
          return (
            <Link
              key={f.label}
              href={href}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active ? "bg-primary text-white" : "bg-secondary/15 text-foreground/70 hover:bg-secondary/25"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <MediaGallery items={mediaItems} />

      <Pagination
        basePath="/admin/media"
        currentParams={{ type: fileType }}
        page={page}
        pageSize={MEDIA_LIBRARY_PAGE_SIZE}
        total={total}
      />
    </div>
  );
}
