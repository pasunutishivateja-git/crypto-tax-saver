import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CapitalGains, Holding } from "@/lib/mockApi";

export interface GainsBreakdown {
  shortTerm: { profit: number; loss: number; net: number };
  longTerm: { profit: number; loss: number; net: number };
  realised: number;
}

function build(
  stProfit: number,
  stLoss: number,
  ltProfit: number,
  ltLoss: number,
): GainsBreakdown {
  const stNet = stProfit - stLoss;
  const ltNet = ltProfit - ltLoss;
  return {
    shortTerm: { profit: stProfit, loss: stLoss, net: stNet },
    longTerm: { profit: ltProfit, loss: ltLoss, net: ltNet },
    realised: stNet + ltNet,
  };
}

interface HarvestContextValue {
  holdings: Holding[];
  selected: Set<string>;
  isSelected: (coin: string) => boolean;
  toggle: (coin: string) => void;
  toggleAll: (checked: boolean) => void;
  allSelected: boolean;
  someSelected: boolean;
  preHarvest: GainsBreakdown;
  postHarvest: GainsBreakdown;
  savings: number;
}

const HarvestContext = createContext<HarvestContextValue | null>(null);

export function HarvestProvider({
  holdings,
  capitalGains,
  children,
}: {
  holdings: Holding[];
  capitalGains: CapitalGains;
  children: ReactNode;
}) {
  // A coin symbol acts as the stable row id in this dataset.
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = useCallback((coin: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(coin)) next.delete(coin);
      else next.add(coin);
      return next;
    });
  }, []);

  const toggleAll = useCallback(
    (checked: boolean) => {
      setSelected(checked ? new Set(holdings.map((h) => h.coin)) : new Set());
    },
    [holdings],
  );

  // Baseline never changes — it is exactly what the capital-gains API returned.
  const preHarvest = useMemo(
    () =>
      build(
        capitalGains.stcg.profit,
        capitalGains.stcg.loss,
        capitalGains.ltcg.profit,
        capitalGains.ltcg.loss,
      ),
    [capitalGains],
  );

  // Post-harvest = baseline + the effect of every currently selected holding.
  // A positive gain adds to profits; a negative gain adds its magnitude to losses.
  const postHarvest = useMemo(() => {
    let stProfit = capitalGains.stcg.profit;
    let stLoss = capitalGains.stcg.loss;
    let ltProfit = capitalGains.ltcg.profit;
    let ltLoss = capitalGains.ltcg.loss;

    for (const h of holdings) {
      if (!selected.has(h.coin)) continue;
      if (h.stcg.gain > 0) stProfit += h.stcg.gain;
      else stLoss += Math.abs(h.stcg.gain);
      if (h.ltcg.gain > 0) ltProfit += h.ltcg.gain;
      else ltLoss += Math.abs(h.ltcg.gain);
    }

    return build(stProfit, stLoss, ltProfit, ltLoss);
  }, [capitalGains, holdings, selected]);

  const value = useMemo<HarvestContextValue>(
    () => ({
      holdings,
      selected,
      isSelected: (coin: string) => selected.has(coin),
      toggle,
      toggleAll,
      allSelected: holdings.length > 0 && selected.size === holdings.length,
      someSelected: selected.size > 0 && selected.size < holdings.length,
      preHarvest,
      postHarvest,
      savings: Math.max(0, preHarvest.realised - postHarvest.realised),
    }),
    [holdings, selected, toggle, toggleAll, preHarvest, postHarvest],
  );

  return <HarvestContext.Provider value={value}>{children}</HarvestContext.Provider>;
}

export function useHarvest() {
  const ctx = useContext(HarvestContext);
  if (!ctx) throw new Error("useHarvest must be used inside <HarvestProvider>");
  return ctx;
}
