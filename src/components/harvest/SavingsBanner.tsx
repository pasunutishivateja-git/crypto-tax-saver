import { formatINR } from "@/lib/format";

/**
 * Only rendered when pre-harvesting realised gains exceed post-harvesting gains,
 * i.e. the user actually saves tax by realising the selected losses.
 */
export function SavingsBanner({ amount }: { amount: number }) {
  return (
    <div className="mt-5 flex items-center gap-2 rounded-2xl bg-success px-4 py-3 text-sm font-semibold text-success-foreground">
      <span aria-hidden>🎉</span>
      <span>You&apos;re going to save {formatINR(amount, 0)}</span>
    </div>
  );
}
