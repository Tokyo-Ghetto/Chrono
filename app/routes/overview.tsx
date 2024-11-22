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
import { ETFCardProps } from "~/types/etf";

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
    const cachedData = await getCachedETFData(ticker, timeframe);
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
      acc[data.ticker] = data as ETFCardProps;
    }
    return acc;
  }, {} as Record<string, ETFCardProps>);

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
    <div className="flex flex-col space-y-8 py-6">
      {Object.entries(categories).map(([key, category]) => (
        <div key={key} className="flex flex-col space-y-4">
          <div className="px-4 sm:px-6">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {category.title}
            </h1>
          </div>

          <ScrollArea className="w-full">
            <div className="px-4 sm:px-6 pb-4">
              <div className="flex snap-x snap-mandatory overflow-x-auto">
                {category.etfs?.map((etf, index) => (
                  <div
                    key={etf.ticker}
                    className={`
                      flex-none 
                      w-[calc(100vw-32px)] 
                      sm:w-[340px] 
                      ${index === 0 ? "" : "sm:ml-6"} 
                      snap-center
                    `}
                  >
                    <ETFCard
                      ticker={etf.ticker}
                      name={etf.name}
                      endPrice={Number(etf.endPrice)}
                      priceChangePercentage={Number(etf.priceChangePercentage)}
                      chartLines={etf.chartLines}
                    />
                  </div>
                ))}
              </div>
            </div>
            <ScrollBar
              orientation="horizontal"
              className="hidden sm:flex px-4 sm:px-6"
            />
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
