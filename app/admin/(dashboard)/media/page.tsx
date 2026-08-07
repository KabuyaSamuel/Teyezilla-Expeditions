import Image from "next/image";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import MediaUploadForm from "@/components/admin/MediaUploadForm";
import MediaDeleteButton from "@/components/admin/MediaDeleteButton";
import { getMediaItems } from "@/lib/admin/data/media";

export default async function AdminMediaPage() {
  const mediaItems = await getMediaItems();
  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Images, videos, PDFs, and travel guide brochures."
        action={<MediaUploadForm />}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mediaItems.map((item) => (
          <div key={item.id} className="card overflow-hidden">
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
                {item.fileType === "pdf" ? "📄" : "🎬"}
              </div>
            )}
            <div className="p-3">
              <p className="truncate text-xs font-medium text-foreground">{item.altText}</p>
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
        {mediaItems.length === 0 && <p className="text-sm text-foreground/50">No media yet.</p>}
      </div>
    </div>
  );
}
