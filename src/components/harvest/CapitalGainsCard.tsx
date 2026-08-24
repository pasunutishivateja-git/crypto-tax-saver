import { formatINR } from "@/lib/format";
import type { GainsBreakdown } from "./HarvestContext";
import { SavingsBanner } from "./SavingsBanner";

interface Props {
  title: string;
  variant: "pre" | "post";
  data: GainsBreakdown;
  savings?: number;
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5 text-sm">
      <span className={muted ? "opacity-60" : "opacity-80"}>{label}</span>
      <span className="font-mono tabular-nums font-medium">{value}</span>
    </div>
  );
}

export function CapitalGainsCard({ title, variant, data, savings = 0 }: Props) {
  const surface =
    variant === "pre"
      ? "bg-harvest-dark text-harvest-dark-foreground"
      : "bg-harvest-blue text-harvest-blue-foreground";

  return (
    <section className={`rounded-3xl p-6 shadow-lg sm:p-7 ${surface}`}>
      <h2 className="font-display text-lg font-bold">{title}</h2>

      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <div>
          {/* Removed opacity-60 to make it perfectly bright */}
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-100">
            Short-term
          </h3>
          <div className="mt-2 divide-y divide-[color-mix(in_oklab,currentColor_15%,transparent)]">
            <Row label="Profits" value={formatINR(data.shortTerm.profit)} />
            <Row label="Losses" value={formatINR(data.shortTerm.loss)} />
            <Row label="Net Gains" value={formatINR(data.shortTerm.net)} />
          </div>
        </div>
        <div>
          {/* Removed opacity-60 to make it perfectly bright */}
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-100">
            Long-term
          </h3>
          <div className="mt-2 divide-y divide-[color-mix(in_oklab,currentColor_15%,transparent)]">
            <Row label="Profits" value={formatINR(data.longTerm.profit)} />
            <Row label="Losses" value={formatINR(data.longTerm.loss)} />
            <Row label="Net Gains" value={formatINR(data.longTerm.net)} />
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-[color-mix(in_oklab,currentColor_20%,transparent)] pt-4">
        <p className="text-sm opacity-90">Realised Capital Gains</p>
        <p className="mt-1 font-mono text-3xl font-bold tabular-nums sm:text-4xl">
          {formatINR(data.realised, 0)}
        </p>
      </div>

      {variant === "post" && savings > 0 ? <SavingsBanner amount={savings} /> : null}
    </section>
  );
}