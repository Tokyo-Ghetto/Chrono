import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { ResponsiveLine, Layer } from "@nivo/line";
import { ActivePoint } from "~/components/chart/ActivePoint";
import { nivoTheme } from "~/components/chart/ChartTheme";
import { transformData } from "~/utils/chart";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  fetchChartData,
  // fetchTickerData,
  TimeframeKey,
  TIMEFRAMES,
} from "~/services/polygon";
import { Fragment } from "react/jsx-runtime";
import { PriceChangeDisplay } from "~/components/chart/PriceChange";
import { getChartColor } from "~/utils/colors";
import { getETFByTicker } from "~/models/etf.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const ticker = url.searchParams.get("ticker");
  const timeframe = (url.searchParams.get("timeframe") as TimeframeKey) || "1D";

  if (!ticker) {
    return json({ chartData: null, tickerData: null });
  }

  const apiKey = process.env.POLY_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not configured");
  }

  const [chartData, tickerData] = await Promise.all([
    fetchChartData(ticker, apiKey, timeframe),
    // fetchTickerData(ticker, apiKey),
    getETFByTicker(ticker),
  ]);
  console.log(tickerData);

  return json({ chartData, tickerData, timeframe });
};

export default function TickerTest() {
  const { chartData, tickerData, timeframe } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const { chartLines, priceChange } = chartData
    ? transformData(chartData, timeframe as TimeframeKey)
    : {
        chartLines: [],
        priceChange: { percentage: 0, startPrice: 0, endPrice: 0 },
      };

  const lineColor = getChartColor(priceChange.percentage);

  const handleTimeframeChange = (newTimeframe: TimeframeKey) => {
    const formData = new FormData();
    if (chartData?.ticker) {
      formData.append("ticker", chartData.ticker);
    }
    formData.append("timeframe", newTimeframe);
    submit(formData, { method: "get" });
  };

  return (
    <div className="bg-slate-900 p-5">
      <div className="flex flex-col items-center">
        <h1 className="my-5 text-2xl font-bold">Index data retriever</h1>
      </div>

      <div className="mt-5">
        {chartLines.length > 0 ? (
          <div id="container" className="h-auto">
            <div
              id="chart_header"
              className="flex flex-row justify-between items-end my-3"
            >
              <div id="titles" className="">
                <h2 className="text-white font-semibold text-xl">
                  {chartData?.ticker}
                </h2>
                <h3 className="text-white font-semibold text-m">
                  {tickerData?.name}
                </h3>
                <PriceChangeDisplay percentage={priceChange.percentage} />
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
                    {/* Key should be the largest timeframe available */}
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
                // Interactivity
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
                          {slice.points[0].data.yFormatted}
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
