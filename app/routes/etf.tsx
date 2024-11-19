import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { ResponsiveLine, Layer } from "@nivo/line";
import { ActivePoint } from "~/components/chart/ActivePoint";
import { nivoTheme } from "~/components/chart/ChartTheme";
import { transformData } from "~/utils/chart";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { fetchChartData, TimeframeKey, TIMEFRAMES } from "~/services/polygon";
import { Fragment } from "react/jsx-runtime";
import { getChartColor } from "~/utils/colors";
import { formatPrice } from "~/utils/format";
import {
  getCachedETFData,
  getETFByTicker,
  isCacheStale,
} from "~/models/etf.server";
import PriceWithDiff from "~/components/chart/NumberFlow";
import { upsertETFCacheData } from "~/db/migrations/etf-cache.server";
import { EtfTransactionPanel } from "~/components/EtfTransactionPanel";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const ticker = url.searchParams.get("ticker") || "SPY"; // Default to SPY if no ticker provided
  const timeframe = (url.searchParams.get("timeframe") as TimeframeKey) || "1D";

  const apiKey = process.env.POLY_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not configured");
  }

  let cachedData = await getCachedETFData(ticker, timeframe);
  const isStale = await isCacheStale(ticker, timeframe);

  let chartData, tickerData;

  if (!cachedData || isStale) {
    console.log(`Making API query for ${ticker}`);
    [chartData, tickerData] = await Promise.all([
      fetchChartData(ticker, apiKey, timeframe),
      getETFByTicker(ticker),
    ]);

    const { chartLines, priceChange } = transformData(chartData, timeframe);

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

  return json({
    ticker: cachedData.ticker,
    name: cachedData.name,
    endPrice: cachedData.last_price,
    priceChangePercentage: cachedData.price_change_percentage,
    chartLines: cachedData.chart_data,
    timeframe,
  });
};

export default function ETF() {
  const {
    ticker,
    name,
    endPrice,
    priceChangePercentage,
    chartLines,
    timeframe,
  } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const lineColor = getChartColor(priceChangePercentage);

  const handleTimeframeChange = (newTimeframe: TimeframeKey) => {
    const formData = new FormData();
    formData.append("ticker", ticker);
    formData.append("timeframe", newTimeframe);
    submit(formData, { method: "get" });
  };

  return (
    <div className="bg-slate-900 p-5">
      <div className="mt-5">
        {chartLines.length > 0 ? (
          <div
            id="container"
            className="
          h-auto flex flex-row justify-between space-x-8
          "
          >
            <div id="etf_info" className="w-full">
              <div
                id="chart_header"
                className="flex flex-row justify-between items-end my-3"
              >
                <div id="titles" className="">
                  <h2 className="text-white font-semibold text-xl">{ticker}</h2>
                  <h3 className="text-white font-semibold text-m">{name}</h3>
                  <PriceWithDiff
                    value={endPrice}
                    diff={priceChangePercentage / 100}
                  />
                </div>
                <div
                  id="chart_time"
                  className="flex items-center space-x-1 text-sm"
                >
                  {(Object.keys(TIMEFRAMES) as TimeframeKey[]).map((key) => (
                    <Fragment key={key}>
                      <Button
                        variant={timeframe === key ? "default" : "outline"}
                        onClick={() => handleTimeframeChange(key)}
                      >
                        {key}
                      </Button>
                      {key !== "1Y" && <Separator orientation="vertical" />}
                    </Fragment>
                  ))}
                </div>
              </div>
              <div id="chart" style={{ height: "35vh" }}>
                <ResponsiveLine
                  data={chartLines}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  xScale={{ type: "point" }}
                  yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: true,
                    reverse: false,
                  }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={null}
                  axisLeft={null}
                  colors={[lineColor]}
                  theme={{
                    ...nivoTheme,
                    crosshair: {
                      line: {
                        stroke: lineColor,
                        strokeWidth: 1,
                        strokeOpacity: 0.35,
                      },
                    },
                  }}
                  pointSize={10}
                  pointColor={{ theme: "background" }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: "serieColor" }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  enablePoints={false}
                  enableGridX={false}
                  enableGridY={false}
                  isInteractive={true}
                  enableSlices="x"
                  enableCrosshair={true}
                  enableTouchCrosshair={true}
                  animate={false}
                  sliceTooltip={({ slice }) => {
                    return (
                      <div
                        style={{
                          background: "transparent",
                          color: "#333333",
                          padding: "5px",
                          border: "1px solid #ccc",
                        }}
                      >
                        <div>
                          <p style={{ fontSize: "0.8rem", color: "white" }}>
                            {slice.points[0].data.xFormatted}
                          </p>
                        </div>
                        <div>
                          <strong style={{ fontSize: "1rem", color: "white" }}>
                            {formatPrice(slice.points[0].data.yFormatted)}
                          </strong>
                        </div>
                      </div>
                    );
                  }}
                  layers={
                    [
                      "grid",
                      "axes",
                      "areas",
                      "lines",
                      "crosshair",
                      "slices",
                      "mesh",
                      "legends",
                      ActivePoint,
                    ] as Layer[]
                  }
                />
              </div>
            </div>
            <EtfTransactionPanel symbol={ticker} price={Number(endPrice)} />
          </div>
        ) : (
          <div>
            <p className="text-center">
              Please use the search field above to retrieve ETF information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
