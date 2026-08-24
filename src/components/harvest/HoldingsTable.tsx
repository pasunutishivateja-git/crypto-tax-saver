import { useState } from "react";
import { useHarvest } from "./HarvestContext";
import { HoldingRow } from "./HoldingRow";
import { SelectAllCheckbox } from "./SelectAllCheckbox";

const COLLAPSED_COUNT = 5;

export function HoldingsTable() {
  const { holdings, selected, allSelected, someSelected, toggleAll } = useHarvest();
  const [expanded, setExpanded] = useState(false);

  const isLongList = holdings.length > COLLAPSED_COUNT;
  const visible = expanded || !isLongList ? holdings : holdings.slice(0, COLLAPSED_COUNT);

  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold">Holdings</h2>
          <p className="text-sm text-muted-foreground">
            Select the positions you want to harvest.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold">
          {selected.size} selected
        </span>
      </header>

      <div className="mt-4 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-full border-collapse sm:min-w-[900px]">
          <thead className="hidden sm:table-header-group">
            {/* Replaced text-muted-foreground with text-slate-100 to brighten headings */}
            <tr className="border-b border-border text-xs uppercase tracking-wider text-slate-100">
              <th className="px-4 py-3 text-left font-semibold">
                <SelectAllCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold">Asset</th>
              <th className="px-4 py-3 text-right font-semibold">Holdings</th>
              <th className="px-4 py-3 text-right font-semibold">Avg Buy Price</th>
              <th className="px-4 py-3 text-right font-semibold">Current Price</th>
              <th className="px-4 py-3 text-right font-semibold">Short-Term Gain</th>
              <th className="px-4 py-3 text-right font-semibold">Long-Term Gain</th>
              <th className="px-4 py-3 text-right font-semibold">Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {/* Mobile-only select-all control */}
            <tr className="sm:hidden">
              <td colSpan={8} className="block pb-3">
                <SelectAllCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  label={allSelected ? "Deselect all" : "Select all"}
                />
              </td>
            </tr>
            {visible.map((h) => (
              <HoldingRow key={h.coin} holding={h} />
            ))}
          </tbody>
        </table>
      </div>

      {isLongList ? (
        <div className="mt-4 text-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
          >
            {expanded ? "Show Less" : `View All (${holdings.length})`}
          </button>
        </div>
      ) : null}
    </section>
  );
}