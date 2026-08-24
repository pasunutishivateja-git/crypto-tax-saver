# Tax Loss Harvesting Tool

A responsive crypto tax-loss-harvesting dashboard. It shows realised capital gains
**before** and **after** harvesting, and lets you select holdings whose gains/losses
get folded into the post-harvesting totals in real time.

## Tech Stack

- React 19 + TypeScript
- TanStack Start / TanStack Router (file-based routing, SSR-capable)
- Tailwind CSS v4 (CSS-first config, semantic design tokens in `src/styles.css`)
- Vite 7

## Setup

```bash
bun install       # or: npm install
bun run dev       # or: npm run dev   → http://localhost:8080
bun run build     # production build
```

## Project Structure

```
src/
  lib/mockApi.ts                  # mock getHoldingsData() + getCapitalGainsData()
  lib/format.ts                   # Indian-numbering ₹ formatting helpers
  components/harvest/
    HarvestContext.tsx            # selection state + derived pre/post gain totals
    CapitalGainsCard.tsx          # dark "Pre-Harvesting" / blue "After Harvesting" card
    SavingsBanner.tsx             # green "You're going to save ₹X" line
    HoldingsTable.tsx             # table shell, select-all, View All / Show Less
    HoldingRow.tsx                # desktop row + mobile stacked card
    SelectAllCheckbox.tsx
    LoadingState.tsx / ErrorState.tsx
  routes/index.tsx                # page: data fetching + layout
```

## Business Logic

- **Pre-Harvesting** values come straight from `getCapitalGainsData()` and never change.
- **After Harvesting** starts identical, then for each selected holding:
  - `stcg.gain > 0` → added to short-term profits, otherwise `|gain|` is added to short-term losses
  - same rule for `ltcg.gain` against the long-term buckets
- `Net Gains = Profits − Losses` per term; `Realised Capital Gains = ST Net + LT Net`.
- Totals are derived with `useMemo` over the set of selected coin symbols
  (baseline + sum of selected effects), so unchecking a row automatically reverses it.
- The savings banner renders only when pre-harvesting realised gains exceed
  post-harvesting realised gains; the amount shown is the difference.
- Checking a row auto-fills **Amount to Sell** with the full `totalHoldings`;
  unchecking clears it.

## Mock API Assumptions

- Both endpoints are plain async functions resolving after a `setTimeout`
  (500–800 ms) to imitate network latency.
- Each call has a ~5% random rejection chance purely to demonstrate the error UI
  and its retry button. Adjust `FAILURE_RATE` in `src/lib/mockApi.ts` (set to `1`
  to force the error state, `0` to disable).
- Holdings use the coin symbol as the row id, assuming symbols are unique in a
  single portfolio. A real API would supply a stable id per lot/position.
- `stcg.balance` / `ltcg.balance` are read as the *quantity* of the asset sitting in
  the short-term vs long-term bucket, so they are rendered as a small secondary
  label under each gain figure.
- The capital-gains baseline is broadly consistent with the sum of the holdings'
  gains but is intentionally not an exact match — it represents gains already
  realised this financial year, independent of the current open positions.
- Harvesting is modelled as all-or-nothing per position: selecting a row realises the
  entire holding. Partial-quantity harvesting would require an editable
  Amount-to-Sell input plus pro-rated gain maths.
- All amounts are INR; formatting uses `Intl.NumberFormat` via
  `toLocaleString("en-IN")` for lakh/crore grouping.
- Coin logos are hot-linked from the CoinGecko public asset CDN.

## Responsiveness

- Cards stack below `lg`.
- The holdings table scrolls horizontally on tablets and collapses into stacked
  cards below `sm`.
- Selected rows get a tinted background, and checkboxes have a subtle press animation.
