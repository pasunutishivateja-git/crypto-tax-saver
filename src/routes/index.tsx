import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { CapitalGainsCard } from "@/components/harvest/CapitalGainsCard";
import { ErrorState } from "@/components/harvest/ErrorState";
import { HarvestProvider, useHarvest } from "@/components/harvest/HarvestContext";
import { HoldingsTable } from "@/components/harvest/HoldingsTable";
import { LoadingState } from "@/components/harvest/LoadingState";
import {
  getCapitalGainsData,
  getHoldingsData,
  type CapitalGains,
  type Holding,
} from "@/lib/mockApi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tax Loss Harvesting Tool — Crypto Capital Gains Optimiser" },
      {
        name: "description",
        content:
          "Compare pre- and post-harvesting realised capital gains, pick the crypto positions to sell, and see exactly how much tax you save.",
      },
      { property: "og:title", content: "Tax Loss Harvesting Tool" },
      {
        property: "og:description",
        content:
          "Select crypto holdings to harvest losses and instantly see your realised capital gains and tax savings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Dashboard() {
  const { preHarvest, postHarvest, savings } = useHarvest();
  return (
    <div className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-2">
        <CapitalGainsCard title="Pre-Harvesting" variant="pre" data={preHarvest} />
        <CapitalGainsCard
          title="After Harvesting"
          variant="post"
          data={postHarvest}
          savings={savings}
        />
      </div>
      <HoldingsTable />
    </div>
  );
}

function Index() {
  const [holdings, setHoldings] = useState<Holding[] | null>(null);
  const [gains, setGains] = useState<CapitalGains | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Both mock endpoints are fetched in parallel on mount.
      const [h, g] = await Promise.all([getHoldingsData(), getCapitalGainsData()]);
      setHoldings(h);
      setGains(g);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Crypto taxes
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Tax Loss Harvesting Tool
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Realise losses selectively to offset your gains. Pick holdings below and watch
            your post-harvesting capital gains update instantly.
          </p>
        </header>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : holdings && gains ? (
          <HarvestProvider holdings={holdings} capitalGains={gains}>
            <Dashboard />
          </HarvestProvider>
        ) : null}
      </div>
    </main>
  );
}
