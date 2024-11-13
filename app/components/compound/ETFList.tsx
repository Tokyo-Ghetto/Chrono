import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useLoaderData } from "@remix-run/react";
import { fetch5YearReturns } from "~/services/fmp";
import { ETFListProps, TickerReturn } from "~/types/compound";
import type { loader } from "~/routes/compound";

export function ETFList({ tickers, onRemove, onReturnsUpdate }: ETFListProps) {
  const { etfData } = useLoaderData<typeof loader>();
  const [returnsData, setReturnsData] = useState<TickerReturn[]>([]);
  const [fetchedTickers, setFetchedTickers] = useState<Set<string>>(new Set());
  const [fetchingTickers, setFetchingTickers] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const newTickers = tickers.filter(
      (ticker) => !fetchedTickers.has(ticker) && !fetchingTickers.has(ticker)
    );

    if (newTickers.length === 0) return;

    const fetchReturns = async () => {
      setFetchingTickers((prev) => new Set([...prev, ...newTickers]));

      const newReturnsData = await Promise.all(
        newTickers.map(async (ticker) => {
          try {
            const { annualizedReturn } = await fetch5YearReturns(ticker);
            return {
              ticker,
              returns: annualizedReturn,
              isLoading: false,
            };
          } catch (error) {
            console.error(`Error fetching returns for ${ticker}:`, error);
            return {
              ticker,
              returns: null,
              isLoading: false,
              error: "Failed to fetch returns",
            };
          }
        })
      );

      setReturnsData((prev) => {
        const existingData = prev.filter((data) =>
          tickers.includes(data.ticker)
        );
        return [...existingData, ...newReturnsData];
      });

      setFetchedTickers((prev) => {
        const next = new Set(prev);
        newTickers.forEach((ticker) => next.add(ticker));
        return next;
      });

      onReturnsUpdate([...newReturnsData]);
      setFetchingTickers((prev) => {
        newTickers.forEach((ticker) => prev.delete(ticker));
        return new Set(prev);
      });
    };

    fetchReturns();
  }, [tickers, fetchedTickers, fetchingTickers, onReturnsUpdate]);

  // Clean up fetchedTickers when tickers are removed
  useEffect(() => {
    setFetchedTickers((prev) => {
      const next = new Set(prev);
      Array.from(prev).forEach((ticker) => {
        if (!tickers.includes(ticker)) {
          next.delete(ticker);
        }
      });
      return next;
    });
  }, [tickers]);

  return (
    <div className="space-y-2">
      {tickers.map((ticker, index) => {
        const returnData = returnsData.find((d) => d.ticker === ticker);

        return (
          <div
            key={index}
            className="flex items-center justify-between bg-stone-700 p-4 rounded-lg w-full"
          >
            <div className="space-y-1">
              <div className="font-medium text-white">{ticker}</div>
              <div className="text-sm text-stone-300">
                {etfData[ticker] || "Loading..."}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-stone-300">
                {returnData?.isLoading
                  ? "Loading..."
                  : returnData?.error
                  ? returnData.error
                  : `5-Year Total Returns: ${
                      returnData?.returns?.toFixed(2) ?? "N/A"
                    }%`}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-stone-400 hover:text-white"
                onClick={() => onRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
