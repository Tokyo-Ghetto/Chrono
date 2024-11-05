interface TimeframeConfig {
  multiplier: number;
  timespan: "minute" | "hour" | "day" | "week" | "month" | "quarter" | "year";
  fromDate: string;
  toDate: string;
}

export const TIMEFRAMES = {
  "1D": {
    multiplier: 5,
    timespan: "minute",
    fromDate: (date: Date) => {
      const adjustedDate = adjustForWeekend(date);
      const yesterday = new Date(adjustedDate);
      yesterday.setDate(yesterday.getDate() - 1);
      return formatDate(yesterday);
    },
    toDate: (date: Date) => formatDate(date),
  },
  "1W": {
    multiplier: 1,
    timespan: "hour",
    fromDate: (date: Date) => {
      const weekAgo = new Date(date);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return formatDate(weekAgo);
    },
    toDate: (date: Date) => formatDate(date),
  },
  "1M": {
    multiplier: 6,
    timespan: "hour",
    fromDate: (date: Date) => {
      const monthAgo = new Date(date);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return formatDate(monthAgo);
    },
    toDate: (date: Date) => formatDate(date),
  },
  // Disabled due to API limitations
  // "3M": {
  //   multiplier: 1,
  //   timespan: "day",
  //   fromDate: (date: Date) => {
  //     const threeMonthsAgo = new Date(date);
  //     threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  //     return formatDate(threeMonthsAgo);
  //   },
  //   toDate: (date: Date) => formatDate(date),
  // },
  YTD: {
    multiplier: 1,
    timespan: "day",
    fromDate: (date: Date) => `${date.getFullYear()}-01-01`,
    toDate: (date: Date) => formatDate(date),
  },
  "1Y": {
    multiplier: 1,
    timespan: "day",
    fromDate: (date: Date) => {
      const yearAgo = new Date(date);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      return formatDate(yearAgo);
    },
    toDate: (date: Date) => formatDate(date),
  },
  // Disabled due to API limitations
  // "2Y": {
  //   multiplier: 1,
  //   timespan: "week",
  //   fromDate: (date: Date) => {
  //     const fiveYearsAgo = new Date(date);
  //     fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 2);
  //     return formatDate(fiveYearsAgo);
  //   },
  //   toDate: (date: Date) => formatDate(date),
  // },
} as const;

export type TimeframeKey = keyof typeof TIMEFRAMES;

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Adjusts the date to the previous Friday if it's a weekend
function adjustForWeekend(date: Date): Date {
  const estDate = new Date(
    date.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const day = estDate.getDay();
  const hours = estDate.getHours();
  const minutes = estDate.getMinutes();

  if (day === 1 && (hours < 9 || (hours === 9 && minutes < 30))) {
    estDate.setDate(estDate.getDate() - 2);
  } else if (day === 0) {
    estDate.setDate(estDate.getDate() - 2);
  } else if (day === 6) {
    estDate.setDate(estDate.getDate() - 1);
  }

  return estDate;
}

function getTimeframeConfig(timeframe: TimeframeKey): TimeframeConfig {
  const config = TIMEFRAMES[timeframe];
  const currentDate = new Date();

  return {
    multiplier: config.multiplier,
    timespan: config.timespan,
    fromDate: config.fromDate(currentDate),
    toDate: config.toDate(currentDate),
  };
}

export async function fetchChartData(
  ticker: string,
  apiKey: string,
  timeframe: TimeframeKey = "1D"
) {
  const config = getTimeframeConfig(timeframe);

  const url = new URL(
    `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${config.multiplier}/${config.timespan}/${config.fromDate}/${config.toDate}`
  );

  url.searchParams.append("adjusted", "false");
  url.searchParams.append("sort", "asc");
  url.searchParams.append("apiKey", apiKey);

  // Add limit parameter for 1M timeframe
  if (timeframe === "1M") {
    url.searchParams.append("limit", "50000");
  }

  const response = await fetch(url.toString());
  return response.json();
}

export async function fetchTickerData(ticker: string, apiKey: string) {
  const url = new URL(`https://api.polygon.io/v3/reference/tickers/${ticker}`);
  url.searchParams.append("apiKey", apiKey);

  const response = await fetch(url.toString());
  return response.json();
}
