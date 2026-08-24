// Mock API layer. Simulates network latency and a rare random failure so the
// error UI can be demonstrated without a real backend.

export interface GainInfo {
  gain: number;
  balance: number;
}

export interface Holding {
  coin: string;
  coinName: string;
  logo: string;
  totalHoldings: number;
  averageBuyPrice: number;
  currentPrice: number;
  stcg: GainInfo;
  ltcg: GainInfo;
}

export interface CapitalGains {
  stcg: { profit: number; loss: number };
  ltcg: { profit: number; loss: number };
}

const HOLDINGS: Holding[] = [
  {
    coin: "BTC",
    coinName: "Bitcoin",
    logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    totalHoldings: 0.62,
    averageBuyPrice: 4250000,
    currentPrice: 5380000,
    stcg: { gain: 420500, balance: 0.24 },
    ltcg: { gain: 280300, balance: 0.38 },
  },
  {
    coin: "ETH",
    coinName: "Ethereum",
    logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    totalHoldings: 8.4,
    averageBuyPrice: 265000,
    currentPrice: 218000,
    stcg: { gain: -184600, balance: 3.1 },
    ltcg: { gain: -210400, balance: 5.3 },
  },
  {
    coin: "SOL",
    coinName: "Solana",
    logo: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    totalHoldings: 145.2,
    averageBuyPrice: 9800,
    currentPrice: 14250,
    stcg: { gain: 312800, balance: 78.4 },
    ltcg: { gain: -46200, balance: 66.8 },
  },
  {
    coin: "MATIC",
    coinName: "Polygon",
    logo: "https://assets.coingecko.com/coins/images/4713/large/polygon.png",
    totalHoldings: 12500,
    averageBuyPrice: 92,
    currentPrice: 41,
    stcg: { gain: -238000, balance: 4600 },
    ltcg: { gain: -399500, balance: 7900 },
  },
  {
    coin: "USDT",
    coinName: "Tether",
    logo: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    totalHoldings: 21400,
    averageBuyPrice: 83.4,
    currentPrice: 84.1,
    stcg: { gain: 8600, balance: 12400 },
    ltcg: { gain: 6380, balance: 9000 },
  },
  {
    coin: "DOGE",
    coinName: "Dogecoin",
    logo: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    totalHoldings: 96000,
    averageBuyPrice: 14.2,
    currentPrice: 9.8,
    stcg: { gain: -126400, balance: 41000 },
    ltcg: { gain: 54900, balance: 55000 },
  },
  {
    coin: "LINK",
    coinName: "Chainlink",
    logo: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    totalHoldings: 640,
    averageBuyPrice: 1120,
    currentPrice: 1685,
    stcg: { gain: 161200, balance: 290 },
    ltcg: { gain: 200400, balance: 350 },
  },
  {
    coin: "AVAX",
    coinName: "Avalanche",
    logo: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    totalHoldings: 310,
    averageBuyPrice: 3400,
    currentPrice: 2280,
    stcg: { gain: -92700, balance: 140 },
    ltcg: { gain: -254900, balance: 170 },
  },
];

const CAPITAL_GAINS: CapitalGains = {
  // Baseline "before harvesting" figures — broadly consistent with the holdings
  // above, but treated as an independent source of truth from the API.
  stcg: { profit: 903100, loss: 641700 },
  ltcg: { profit: 542000, loss: 911000 },
};

/** ~5% simulated failure rate so the retry UI is reachable in a demo. */
const FAILURE_RATE = 0.05;

function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < FAILURE_RATE) {
        reject(new Error("Network request failed. Please try again."));
        return;
      }
      resolve(value);
    }, ms);
  });
}

export function getHoldingsData(): Promise<Holding[]> {
  return delay(HOLDINGS, 600 + Math.random() * 200);
}

export function getCapitalGainsData(): Promise<CapitalGains> {
  return delay(CAPITAL_GAINS, 500 + Math.random() * 250);
}
