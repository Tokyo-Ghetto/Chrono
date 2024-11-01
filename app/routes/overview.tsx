import ETFCard from "~/components/card/ETFCard";
import { useLoaderData } from "@remix-run/react";
import { fetchChartData } from "~/services/polygon";
import { transformData } from "~/utils/chart";
import { LoaderData } from "~/types";
import {
  getETFByTicker,
  getCachedETFData,
  isCacheStale,
} from "~/models/etf.server";
import { upsertETFCacheData } from "~/db/migrations/etf-cache.server";

export const loader = async ({ req }) => {
  const tickers = ["SPY", "VOO", "QQQ", "VAW"]; // Array of tickers to display
  const timeframe = "1W"; // Overview page's cards should display 1W charts

  const apiKey = process.env.POLY_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not configured");
  }

  const etfDataPromises = tickers.map(async (ticker) => {
    let cachedData = await getCachedETFData(ticker, timeframe);
    const isStale = await isCacheStale(ticker, timeframe);

    if (!cachedData || isStale) {
      console.log(`Making API query for ${ticker}`);
      const [chartData, tickerData] = await Promise.all([
        fetchChartData(ticker, apiKey, timeframe),
        getETFByTicker(ticker),
      ]);

      const { chartLines, priceChange } = chartData
        ? transformData(chartData, timeframe)
        : {
            chartLines: [],
            priceChange: { percentage: 0, startPrice: 0, endPrice: 0 },
          };

      // Update cache
      await upsertETFCacheData(
        ticker,
        priceChange.endPrice,
        priceChange.percentage,
        chartLines,
        timeframe
      );

      cachedData = {
        ticker,
        name: tickerData?.name,
        last_price: priceChange.endPrice,
        price_change_percentage: priceChange.percentage,
        chart_data: chartLines,
      };
    }

    return {
      ticker: cachedData.ticker,
      name: cachedData.name,
      endPrice: cachedData.last_price,
      priceChangePercentage: cachedData.price_change_percentage,
      chartLines: cachedData.chart_data,
    };
  });

  const etfData = await Promise.all(etfDataPromises);

  return { etfData };
};

export default function Overview() {
  const { etfData } = useLoaderData() as LoaderData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {etfData.map((etf) => (
        <ETFCard
          key={etf.ticker}
          ticker={etf.ticker}
          name={etf.name}
          endPrice={etf.endPrice}
          priceChangePercentage={etf.priceChangePercentage}
          chartLines={etf.chartLines}
        />
      ))}
    </div>
  );
}
