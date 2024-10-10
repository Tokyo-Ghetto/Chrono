import type { TimeframeKey } from "~/services/polygon";
import {
  ChartData,
  FormattedData,
  PriceChangeInfo,
  TransformedChartData,
} from "~/types";

export function transformData(
  chartData: ChartData,
  timeframe: TimeframeKey
): TransformedChartData {
  if (!chartData || !chartData.results || chartData.results.length === 0) {
    return {
      chartLines: [],
      priceChange: { percentage: 0, startPrice: 0, endPrice: 0 },
    };
  }

  const results = chartData.results;
  const startPrice = results[0].c;
  const endPrice = results[results.length - 1].c;
  const priceChange = calculatePriceChange(startPrice, endPrice);

  const transformedData: FormattedData[] = [
    {
      id: chartData.ticker || "unknown",
      data: results.map((result) => ({
        x: formatDateChart(result.t, timeframe),
        y: result.c,
      })),
    },
  ];

  return {
    chartLines: transformedData,
    priceChange,
  };
}

export function formatDateChart(
  timestamp: number,
  timeframe: TimeframeKey
): string {
  const date = new Date(timestamp);

  const timeOnly = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  } as const;

  const dayAndTime = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  } as const;

  const dateOnly = {
    month: "short",
    day: "numeric",
    year: "numeric",
  } as const;

  switch (timeframe) {
    case "1D":
      return date.toLocaleString("en-US", timeOnly);

    case "1W":
    case "1M":
      return date.toLocaleString("en-US", dayAndTime);

    case "3M":
    case "YTD":
    case "1Y":
    case "2Y":
      return date.toLocaleString("en-US", dateOnly);

    default:
      throw new Error(`Unsupported timeframe: ${timeframe}`);
  }
}

export function randomTicker(): string {
  const etfList = [
    "SPY",
    "IVV",
    "VOO",
    "QQQ",
    "VTI",
    "VEA",
    "VWO",
    "IEMG",
    "EFA",
    "AGG",
    "BND",
    "LQD",
    "XLK",
    "XLF",
    "XLE",
    "XLY",
    "XLV",
    "XLI",
    "XLP",
    "XLB",
    "XLU",
    "VNQ",
    "SCHD",
    "VYM",
    "ARKK",
    "VT",
    "IWM",
    "DIA",
    "TLT",
    "VIG",
    "VTV",
    "IJH",
    "IJR",
    "VGT",
    "VO",
    "VCR",
    "ITOT",
  ];
  return etfList[Math.floor(Math.random() * etfList.length)];
}

export function calculatePriceChange(
  startPrice: number,
  endPrice: number
): PriceChangeInfo {
  const percentage = ((endPrice - startPrice) / startPrice) * 100;

  return {
    percentage,
    startPrice,
    endPrice,
  };
}
