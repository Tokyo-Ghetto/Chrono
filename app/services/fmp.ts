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
