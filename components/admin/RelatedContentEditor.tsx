"use client";

import RelatedContentPicker from "./RelatedContentPicker";

export default function RelatedContentEditor({
  journeys,
  tours,
  blogPosts,
  relatedJourneyIds,
  onChangeRelatedJourneyIds,
  relatedTourIds,
  onChangeRelatedTourIds,
  relatedBlogPostIds,
  onChangeRelatedBlogPostIds,
}: {
  journeys: { id: string; label: string }[];
  tours: { id: string; label: string }[];
  blogPosts: { id: string; label: string }[];
  relatedJourneyIds: string[];
  onChangeRelatedJourneyIds: (ids: string[]) => void;
  relatedTourIds: string[];
  onChangeRelatedTourIds: (ids: string[]) => void;
  relatedBlogPostIds: string[];
  onChangeRelatedBlogPostIds: (ids: string[]) => void;
}) {
  return (
    <section className="card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Bring This to Life</h2>
      <p className="mt-1 text-xs text-foreground/50">
        Manually pick what shows in this journey&rsquo;s &ldquo;Bring This to Life&rdquo; section. Leave a list empty
        and it automatically shows items from the same destination instead.
      </p>
      <div className="mt-4 grid gap-6 sm:grid-cols-3">
        <RelatedContentPicker
          title="Related Journeys"
          items={journeys}
          selectedIds={relatedJourneyIds}
          onChange={onChangeRelatedJourneyIds}
          emptyMessage="No other journeys yet."
        />
        <RelatedContentPicker
          title="Related Tours"
          items={tours}
          selectedIds={relatedTourIds}
          onChange={onChangeRelatedTourIds}
          emptyMessage="No tours yet."
        />
        <RelatedContentPicker
          title="Related Articles"
          items={blogPosts}
          selectedIds={relatedBlogPostIds}
          onChange={onChangeRelatedBlogPostIds}
          emptyMessage="No blog posts yet."
        />
      </div>
    </section>
  );
}
