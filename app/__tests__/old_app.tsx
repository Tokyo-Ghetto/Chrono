import { Router } from "express";
import * as dotenv from "dotenv";
import path from "path";

// let __dirname = path.resolve("./src/__tests__");

dotenv.config();
const key = process.env.POLY_API_KEY;
export const testRoute = Router();

testRoute.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "test.html"));
});

testRoute.get("/api/index-data", async (req, res) => {
  const ticker = req.query.ticker as string;
  if (!ticker) {
    return res.status(400).json({ error: "Ticker is required" });
  }

  try {
    // Get previous close
    // const data = await getData(ticker);

    // Get data for charts
    const data = await getChartData(
      ticker,
      1,
      "week",
      "2023-01-01",
      "2024-01-01",
      false
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ETF data" });
  }
});

//Structure of the API response for the previous close of a ticker
interface PreviousClose {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: {
    T: string;
    v: number;
    vw: number;
    o: number;
    c: number;
    h: number;
    l: number;
    t: number;
    n: number;
  };
  status: string;
  request_id: string;
  count: number;
}

//Get the previous day's open, high,
//low, and close (OHLC) for the specified stock ticker.
const getData = async (tick: string): Promise<any> => {
  console.log("Retrieving the previous close data for " + tick + ".");
  const response = await fetch(
    `https://api.polygon.io/v2/aggs/ticker/${tick}/prev?adjusted=true&apiKey=${key}`
  );
  const data = await response.json();
  console.log("Data succesfully retrieved!");
  return data;
};

const getChartData = async (
  tick: string,
  mult: number,
  timespan: string,
  datefrom: string | number,
  dateto: string | number,
  adj: boolean
): Promise<any> => {
  console.log("Retrieving aggregated chart data of " + tick + ".");
  const response = await fetch(
    `https://api.polygon.io/v2/aggs/ticker/${tick}/range/${mult}/${timespan}/${datefrom}/${dateto}?adjusted=${adj}&sort=asc&apiKey=${key}`
  );
  const data = await response.json();
  console.log("Data succesfully retrieved!");
  return data;
};

// Retrieve ticker information such as name, currency, market, etc.
// https://api.polygon.io/v3/reference/tickers?ticker=${tick}&active=true&limit=100&apiKey=${key}

// Retrieve aggregate bars for a ticker over a given date range in custom time window sizes.
// https://api.polygon.io/v2/aggs/ticker/${tick}/range/${mult}/${timespan}/${datefrom}/${dateto}?adjusted=${adj}&sort=asc&apiKey=${key}
//  Parameters:
// ${1}: multiplier. If timespan is set to minute, and multiplier is 5, then 5-minute bar will be returned.
// ${timespan}: specified timespan (hour, day, week, month, quarter year)
// ${datefrom}, ${dateto}: Can be either a date formatted as YYYY-MM-DD, or ms timestamp
// ${adj}: Whether or not the results should be split (boolean). True is recommended when dealing with long responses.

// Names and tickers of the 10 most traded ETFs in the US:
// SPDR S&P 500 ETF Trust (SPY): Tracks the S&P 500 Index.
// iShares Core S&P 500 ETF (IVV): Tracks the S&P 500 Index.
// Vanguard S&P 500 ETF (VOO): Tracks the S&P 500 Index.
// Invesco QQQ Trust (QQQ): Tracks the Nasdaq-100 Index.
// iShares Core U.S. Aggregate Bond ETF (AGG): Tracks the U.S. Aggregate Bond Index.
// Vanguard Total Stock Market ETF (VTI): Tracks the total U.S. stock market.
// iShares 20+ Year Treasury Bond ETF (TLT): Tracks the 20+ year U.S. Treasury bond market.
// ProShares UltraShort QQQ (SQQQ): A leveraged ETF that aims to deliver twice the inverse daily return of the Nasdaq-100 Index.
// United States Oil Fund LP (USO): Tracks the price of West Texas Intermediate (WTI) crude oil futures.
// iShares iBonds Dec 2024 Term ETF (IBND): A short-term bond ETF that matures in December 2024.

// Valid response
// {
//   "ticker": "QQQ",
//   "queryCount": 1,
//   "resultsCount": 1,
//   "adjusted": true,
//   "results": [
//     {
//       "T": "QQQ",
//       "v": 26510339,
//       "vw": 486.034,
//       "o": 484.74,
//       "c": 485.82,
//       "h": 487.79,
//       "l": 484.56,
//       "t": 1727294400000,
//       "n": 273223
//     }
//   ],
//   "status": "OK",
//   "request_id": "0fb2bc4f0887bbef8f12bdc91e72468f",
//   "count": 1
// }

// Response when retrieving non-existing ticker
// {
//   "ticker": "VTITDSF",
//   "queryCount": 0,
//   "resultsCount": 0,
//   "adjusted": true,
//   "status": "OK",
//   "request_id": "421796cef285b0ffa747c5cfd743270c"
// }
