function GoodToKnowList({ items }: { items: string[] }) {
  return (
    <ul className="mt-1 space-y-1.5 text-sm text-foreground/70">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="text-accent">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ProductGoodToKnow({
  bringList,
  importantInfo,
  cancellationPolicy,
}: {
  bringList: string[];
  importantInfo: string[];
  cancellationPolicy: string[];
}) {
  if (bringList.length === 0 && importantInfo.length === 0 && cancellationPolicy.length === 0) return null;

  return (
    <div className="card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Good to Know</h2>
      <div className="mt-4 space-y-4">
        {bringList.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Bring With You</p>
            <GoodToKnowList items={bringList} />
          </div>
        )}
        {importantInfo.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Please Note</p>
            <GoodToKnowList items={importantInfo} />
          </div>
        )}
        {cancellationPolicy.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Cancellation & Refund</p>
            <GoodToKnowList items={cancellationPolicy} />
          </div>
        )}
      </div>
    </div>
  );
}
