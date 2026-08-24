/** Skeleton shown while both mock APIs resolve. */
export function LoadingState() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <div className="grid gap-5 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-3xl border border-border bg-muted"
          />
        ))}
      </div>
      <div className="space-y-3 rounded-3xl border border-border bg-card p-5">
        <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <span className="sr-only">Loading your capital gains data…</span>
    </div>
  );
}
