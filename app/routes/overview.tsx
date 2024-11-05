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
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

const ETF_CATEGORIES = {
  overall: {
    title: "Most Popular ETFs",
    tickers: [
      "SPY",
      "IVV",
      "VTI",
      "QQQ",
      "VOO",
      "EEM",
      "IWM",
      "EFA",
      "VEA",
      "VWO",
    ],
  },
  sp500: {
    title: "S&P 500",
    tickers: [
      "SPY",
      "IVE",
      "VOO",
      "SPLG",
      "IVW",
      "SCHX",
      "IVV",
      "SDY",
      "RSP",
      "DGRO",
    ],
  },
  nasdaq: {
    title: "Nasdaq",
    tickers: [
      "QQQ",
      "QQQM",
      "ONEQ",
      "QQQJ",
      "QQQN",
      "TQQQ",
      "QQEW",
      "QYLD",
      "IBB",
      "TQQQ",
    ],
  },
};

export const loader = async () => {
  const allTickers = [
    ...new Set([
      ...ETF_CATEGORIES.overall.tickers,
      ...ETF_CATEGORIES.sp500.tickers,
      ...ETF_CATEGORIES.nasdaq.tickers,
    ]),
  ];
  const timeframe = "1M"; // Overview page's cards display 1M charts to avoid API limits

  const apiKey = process.env.POLY_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not configured");
  }

  const etfDataPromises = allTickers.map(async (ticker) => {
    let cachedData = await getCachedETFData(ticker, timeframe);
    const isStale = await isCacheStale(ticker, timeframe);

    if (!cachedData) {
      // console.log(`Making API query for ${ticker}`);
      try {
        const [chartData, tickerData] = await Promise.all([
          fetchChartData(ticker, apiKey, timeframe),
          getETFByTicker(ticker),
        ]);

        if (!chartData) {
          // console.log(`${ticker} API query failed: No data available`);
          return null;
        }

        const { chartLines, priceChange } = transformData(chartData, timeframe);

        // Only update cache if we have valid data
        if (chartLines && priceChange.endPrice !== 0) {
          await upsertETFCacheData(
            ticker,
            priceChange.endPrice,
            priceChange.percentage,
            chartLines,
            timeframe
          );
        }

        return {
          ticker,
          name: tickerData?.name,
          endPrice: priceChange.endPrice,
          priceChangePercentage: priceChange.percentage,
          chartLines,
        };
      } catch (error) {
        console.error(`${ticker} API query failed:`, error);
        return null;
      }
    } else if (isStale) {
      // console.log(`Making API query for ${ticker}`);
      try {
        const chartData = await fetchChartData(ticker, apiKey, timeframe);

        if (!chartData) {
          // console.log(`${ticker} API query failed: Displaying stale data`);
          return {
            ticker: cachedData.ticker,
            name: cachedData.name,
            endPrice: cachedData.last_price,
            priceChangePercentage: cachedData.price_change_percentage,
            chartLines: cachedData.chart_data,
          };
        }

        const { chartLines, priceChange } = transformData(chartData, timeframe);

        // Only update cache if we have valid data
        if (chartLines && priceChange.endPrice !== 0) {
          await upsertETFCacheData(
            ticker,
            priceChange.endPrice,
            priceChange.percentage,
            chartLines,
            timeframe
          );
        } else {
          // If new data is invalid, keep using cached data
          return {
            ticker: cachedData.ticker,
            name: cachedData.name,
            endPrice: cachedData.last_price,
            priceChangePercentage: cachedData.price_change_percentage,
            chartLines: cachedData.chart_data,
          };
        }

        return {
          ticker,
          name: cachedData.name,
          endPrice: priceChange.endPrice,
          priceChangePercentage: priceChange.percentage,
          chartLines,
        };
      } catch (error) {
        // console.log(`${ticker} API query failed: Displaying stale data`);
        return {
          ticker: cachedData.ticker,
          name: cachedData.name,
          endPrice: cachedData.last_price,
          priceChangePercentage: cachedData.price_change_percentage,
          chartLines: cachedData.chart_data,
        };
      }
    } else {
      // console.log(`Using cached data for ${ticker}`);
      return {
        ticker: cachedData.ticker,
        name: cachedData.name,
        endPrice: cachedData.last_price,
        priceChangePercentage: cachedData.price_change_percentage,
        chartLines: cachedData.chart_data,
      };
    }
  });

  const etfDataResults = await Promise.all(etfDataPromises);
  const etfDataMap = etfDataResults.reduce((acc, data) => {
    if (data) {
      acc[data.ticker] = data;
    }
    return acc;
  }, {} as Record<string, any>);

  return {
    categories: {
      overall: {
        title: ETF_CATEGORIES.overall.title,
        etfs: ETF_CATEGORIES.overall.tickers
          .map((ticker) => etfDataMap[ticker])
          .filter(Boolean),
      },
      sp500: {
        title: ETF_CATEGORIES.sp500.title,
        etfs: ETF_CATEGORIES.sp500.tickers
          .map((ticker) => etfDataMap[ticker])
          .filter(Boolean),
      },
      nasdaq: {
        title: ETF_CATEGORIES.nasdaq.title,
        etfs: ETF_CATEGORIES.nasdaq.tickers
          .map((ticker) => etfDataMap[ticker])
          .filter(Boolean),
      },
    },
  };
};

export default function Overview() {
  const { categories } = useLoaderData() as LoaderData;

  return (
    <div>
      {Object.entries(categories).map(([key, category]) => (
        <div key={key}>
          <div className="p-5 py-2">
            <h1 className="my-1 text-2xl font-bold">{category.title}</h1>
          </div>
          <ScrollArea className="w-full whitespace-nowrap pb-1">
            <div className="flex w-max space-x-4 p-4">
              {category.etfs.map((etf) => (
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
            <ScrollBar orientation="horizontal" className="mb-1 px-4" />
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
