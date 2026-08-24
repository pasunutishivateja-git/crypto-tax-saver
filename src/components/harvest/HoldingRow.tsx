import { formatAmount, formatINR, formatSignedINR } from "@/lib/format";
import type { Holding } from "@/lib/mockApi";
import { useHarvest } from "./HarvestContext";

function GainCell({ gain, balance, coin }: { gain: number; balance: number; coin: string }) {
  return (
    <div className="text-right">
      <p className={`font-mono tabular-nums ${gain >= 0 ? "text-gain" : "text-loss"}`}>
        {formatSignedINR(gain, 0)}
      </p>
      <p className="text-xs text-muted-foreground">
        {formatAmount(balance)} {coin}
      </p>
    </div>
  );
}

export function HoldingRow({ holding }: { holding: Holding }) {
  const { isSelected, toggle } = useHarvest();
  const checked = isSelected(holding.coin);

  return (
    <>
      {/* Desktop / tablet table row */}
      <tr
        onClick={() => toggle(holding.coin)}
        className={`hidden cursor-pointer border-b border-border transition-colors sm:table-row ${
          checked ? "bg-row-selected" : "hover:bg-muted/60"
        }`}
      >
        <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={checked}
            aria-label={`Select ${holding.coinName}`}
            onChange={() => toggle(holding.coin)}
            onClick={(e) => e.stopPropagation()}
            className="size-4 cursor-pointer accent-[var(--harvest-blue)] transition-transform active:scale-90"
          />
        </td>
        <td className="px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={holding.logo}
              alt={`${holding.coinName} logo`}
              loading="lazy"
              className="size-8 shrink-0 rounded-full bg-muted"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{holding.coinName}</p>
              <p className="text-xs text-muted-foreground">{holding.coin}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
          {formatAmount(holding.totalHoldings)} {holding.coin}
        </td>
        <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
          {formatINR(holding.averageBuyPrice)}
        </td>
        <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
          {formatINR(holding.currentPrice)}
        </td>
        <td className="px-4 py-3 text-sm">
          <GainCell {...holding.stcg} coin={holding.coin} />
        </td>
        <td className="px-4 py-3 text-sm">
          <GainCell {...holding.ltcg} coin={holding.coin} />
        </td>
        <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
          {/* Auto-fills with the full position the moment the row is checked. */}
          {checked ? `${formatAmount(holding.totalHoldings)} ${holding.coin}` : "—"}
        </td>
      </tr>

      {/* Mobile stacked card */}
      <tr className="sm:hidden">
        <td colSpan={8} className="block p-0">
          <button
            type="button"
            onClick={() => toggle(holding.coin)}
            className={`mb-3 block w-full rounded-2xl border p-4 text-left transition-colors ${
              checked ? "border-harvest-blue bg-row-selected" : "border-border bg-card"
            }`}
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={holding.logo}
                  alt={`${holding.coinName} logo`}
                  loading="lazy"
                  className="size-8 shrink-0 rounded-full bg-muted"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{holding.coinName}</p>
                  <p className="text-xs text-muted-foreground">{holding.coin}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={checked}
                aria-label={`Select ${holding.coinName}`}
                onChange={() => toggle(holding.coin)}
                onClick={(e) => e.stopPropagation()}
                className="size-4 shrink-0 accent-[var(--harvest-blue)]"
              />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Holdings</dt>
                <dd className="font-mono tabular-nums">
                  {formatAmount(holding.totalHoldings)} {holding.coin}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Current Price</dt>
                <dd className="font-mono tabular-nums">{formatINR(holding.currentPrice)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Avg Buy Price</dt>
                <dd className="font-mono tabular-nums">
                  {formatINR(holding.averageBuyPrice)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Amount to Sell</dt>
                <dd className="font-mono tabular-nums">
                  {checked ? `${formatAmount(holding.totalHoldings)} ${holding.coin}` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Short-Term</dt>
                <dd
                  className={`font-mono tabular-nums ${
                    holding.stcg.gain >= 0 ? "text-gain" : "text-loss"
                  }`}
                >
                  {formatSignedINR(holding.stcg.gain, 0)}
                  <span className="block text-muted-foreground">
                    {formatAmount(holding.stcg.balance)} {holding.coin}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Long-Term</dt>
                <dd
                  className={`font-mono tabular-nums ${
                    holding.ltcg.gain >= 0 ? "text-gain" : "text-loss"
                  }`}
                >
                  {formatSignedINR(holding.ltcg.gain, 0)}
                  <span className="block text-muted-foreground">
                    {formatAmount(holding.ltcg.balance)} {holding.coin}
                  </span>
                </dd>
              </div>
            </dl>
          </button>
        </td>
      </tr>
    </>
  );
}
