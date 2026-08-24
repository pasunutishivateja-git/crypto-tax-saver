import React from "react";
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
          {/* Header & Tooltip Row */}
          <div className="flex items-center gap-4 mb-6">
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Tax Optimisation
            </h1>

            {/* Tooltip Container */}
            <div className="relative group inline-block">
              <span className="text-blue-500 text-sm cursor-pointer underline decoration-dashed decoration-blue-500/50 hover:decoration-blue-500 underline-offset-4">
                How it works?
              </span>

              {/* Popover Content */}
              <div className="absolute left-0 top-full mt-2 w-80 p-4 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-xs text-foreground">
                <ul className="list-disc pl-4 space-y-1.5 mb-3 text-muted-foreground">
                  <li>See your capital gains for FY 2024-25 in the left card</li>
                  <li>Check boxes for assets you plan on selling to reduce your tax liability</li>
                  <li>Instantly see your updated tax liability in the right card</li>
                </ul>
                <p className="font-medium text-foreground">
                  Pro tip:{" "}
                  <span className="text-muted-foreground font-normal">
                    Experiment with different combinations of your holdings to optimize your tax
                    liability
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Accordion Details Block */}
          <details className="bg-card border border-border rounded-xl group cursor-pointer overflow-hidden">
            <summary className="flex items-center p-4 text-sm font-medium text-foreground list-none hover:bg-white/5 transition-colors">
              {/* Info Icon */}
              <svg
                className="w-5 h-5 mr-3 text-blue-500 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Important Notes And Disclaimers
              {/* Down Arrow */}
              <svg
                className="w-4 h-4 ml-auto text-muted-foreground transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>

            {/* Dropdown Content */}
            <div className="px-11 pb-5 text-xs text-muted-foreground space-y-3 bg-card pt-2">
              <p>
                <strong className="text-foreground font-semibold">Price Source Disclaimer:</strong>{" "}
                Please note that the current price of your coins may differ from the prices listed
                on specific exchanges. This is because we use CoinGecko as our default price source
                for certain exchanges, rather than fetching prices directly from the exchange.
              </p>
              <p>
                <strong className="text-foreground font-semibold">
                  Country-specific Availability:
                </strong>{" "}
                Tax loss harvesting may not be supported in all countries. We strongly recommend
                consulting with your local tax advisor or accountant before performing any related
                actions on your exchange.
              </p>
              <p>
                <strong className="text-foreground font-semibold">Utilization of Losses:</strong>{" "}
                Tax loss harvesting typically allows you to offset capital gains. However, if you
                have zero or no applicable crypto capital gains, the usability of these harvested
                losses may be limited. Kindly confirm with your tax advisor how such losses can be
                applied in your situation.
              </p>
            </div>
          </details>
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
