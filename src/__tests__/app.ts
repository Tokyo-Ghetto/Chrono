import { Router } from "express";
import * as dotenv from "dotenv";

dotenv.config();
const key = process.env.POLY_API_KEY;
export const testRoute = Router();

testRoute.get("/test", (req, res) => {
  res.send(getData("VOO"));
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

const getData = async (tick: string): Promise<any> => {
  console.log("Retrieving the previous close data for " + tick + ".");
  const response = await fetch(
    `https://api.polygon.io/v2/aggs/ticker/${tick}/prev?adjusted=true&apiKey=${key}`
  );
  const data = await response.json();
  console.log(data);
  console.log("Data succesfully retrieved!");
  return data;
};

//Name and ticker of the 10 most traded ETFs in the US:
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
