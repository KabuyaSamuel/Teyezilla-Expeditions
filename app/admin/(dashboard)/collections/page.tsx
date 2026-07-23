import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getAdminCollections } from "@/lib/admin/data/collections";
import { contentStatusTone } from "@/lib/admin/status-tone";

export default async function AdminCollectionsPage() {
  const collections = await getAdminCollections();

  return (
    <div>
      <PageHeader
        title="Collections"
        description="Curated groupings of tours and journeys, e.g. The Wild, The Ocean, The Heritage."
        action={
          <Link href="/admin/collections/new" className="btn-primary text-sm">
            + Add Collection
          </Link>
        }
      />

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-5 py-3">Collection</th>
              <th className="px-5 py-3">Tours</th>
              <th className="px-5 py-3">Journeys</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.id} className="border-b border-secondary/10 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{collection.name}</td>
                <td className="px-5 py-3 text-foreground/70">{collection.tourCount}</td>
                <td className="px-5 py-3 text-foreground/70">{collection.journeyCount}</td>
                <td className="px-5 py-3">
                  <Badge tone={contentStatusTone(collection.status)}>{collection.status}</Badge>
                </td>
                <td className="px-5 py-3">
                  <Link href={`/admin/collections/${collection.slug}`} className="text-primary hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {collections.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-sm text-foreground/50">
                  No collections yet. Add the first one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
