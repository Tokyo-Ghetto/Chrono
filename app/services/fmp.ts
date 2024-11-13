// The purpose of this page is to fetch historic ETF data for a specific ticker.
// Here's an example of the response:
// [
//     {
//       "symbol": "QQQ",
//       "1D": 0.1168,
//       "5D": 2.71296,
//       "1M": 4.21193,
//       "3M": 14.14933,
//       "6M": 16.30548,
//       "ytd": 27.70809,
//       "1Y": 36.30073,
//       "3Y": 31.63163,
//       "5Y": 155.84196,
//       "10Y": 402.67892,
//       "max": 906.93302
//     }
//   ]
// Here's the link that will be used to perform the fetch:
// https://financialmodelingprep.com/api/v3/stock-price-change/{ticker}?apikey={process.env.FMP_API_KEY}
// After receiving the response, calculate the annualized return for the 5-year period using the formula below:
// function calculateAnnualizedReturn(totalReturnPercentage: number, years: number): number {
//     // Convert percentage to decimal
//     const totalReturnDecimal = totalReturnPercentage / 100;
//     // Calculate annualized return
//     const annualizedReturn = (Math.pow(1 + totalReturnDecimal, 1/years) - 1) * 100;
//     return annualizedReturn;
//   }
//   // Usage example
//   const fiveYearTotal = 155.84196;
//   const annualizedReturn = calculateAnnualizedReturn(fiveYearTotal, 5);
//   // This should give you approximately 20.48%

// Here's the actual implementation:
export async function fetch5YearReturns(ticker: string) {
  console.log("Fetching 5-year returns for", ticker);
  const apiKey = import.meta.env.VITE_FMP_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not configured");
  }

  const url = new URL(
    `https://financialmodelingprep.com/api/v3/stock-price-change/${ticker}`
  );
  url.searchParams.append("apikey", apiKey);

  const response = await fetch(url.toString());
  const data = await response.json();

  const fiveYearTotal = data[0]["5Y"];
  const annualizedReturn = calculateAnnualizedReturn(fiveYearTotal, 5);

  return {
    annualizedReturn,
  };
}

// Calculate the annualized return for a 5-year period
function calculateAnnualizedReturn(
  totalReturnPercentage: number,
  years: number
): number {
  // Convert percentage to decimal
  const totalReturnDecimal = totalReturnPercentage / 100;
  // Calculate annualized return
  const annualizedReturn =
    (Math.pow(1 + totalReturnDecimal, 1 / years) - 1) * 100;
  return annualizedReturn;
}
