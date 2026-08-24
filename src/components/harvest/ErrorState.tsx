interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

/** Graceful failure UI for the simulated random API error. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-destructive/15 text-2xl">
        !
      </div>
      <div>
        <h2 className="font-display text-lg font-bold text-foreground">
          We couldn&apos;t load your holdings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
