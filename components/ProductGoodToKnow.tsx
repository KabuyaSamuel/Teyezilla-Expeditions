export default function ProductGoodToKnow({
  bringList,
  importantInfo,
  cancellationPolicy,
}: {
  bringList: string[];
  importantInfo: string;
  cancellationPolicy: string;
}) {
  if (bringList.length === 0 && !importantInfo && !cancellationPolicy) return null;

  return (
    <div className="card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Good to Know</h2>
      <div className="mt-4 space-y-4">
        {bringList.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Bring With You</p>
            <p className="mt-1 text-sm text-foreground/70">{bringList.join(", ")}</p>
          </div>
        )}
        {importantInfo && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Please Note</p>
            <p className="mt-1 text-sm text-foreground/70">{importantInfo}</p>
          </div>
        )}
        {cancellationPolicy && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Cancellation & Refund</p>
            <p className="mt-1 text-sm text-foreground/70">{cancellationPolicy}</p>
          </div>
        )}
      </div>
    </div>
  );
}
