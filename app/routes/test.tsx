import { LoaderFunction, json } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { DotsItem, useTheme } from "@nivo/core";
import {
  ResponsiveLine,
  Layer,
  SliceTooltipProps,
  CustomLayerProps,
} from "@nivo/line";
import { etfList } from "~/__tests__/etfs";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const ticker = url.searchParams.get("ticker");

  if (!ticker) {
    return json({ chartData: null, tickerData: null });
  }

  const key = process.env.POLY_API_KEY;
  const mult = 5;
  const timespan = "minute";
  const datefrom = "2024-10-01";
  const dateto = "2024-10-02";
  const adj = true;

  const [chartData, tickerData] = await Promise.all([
    fetch(
      `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${mult}/${timespan}/${datefrom}/${dateto}?adjusted=${adj}&sort=asc&apiKey=${key}`
    ).then((res) => res.json()),
    fetch(
      `https://api.polygon.io/v3/reference/tickers?ticker=${ticker}&active=true&limit=100&apiKey=${key}`
    ).then((res) => res.json()),
  ]);

  return json({ chartData, tickerData });
};

interface Result {
  v: number; // Volume
  vw: number; // Volume-weighted average price
  o: number; // Open price
  c: number; // Close price
  h: number; // High price
  l: number; // Low price
  t: number; // Timestamp
  n: number; // Number of transactions
}

interface ChartData {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: Result[];
  status: string;
  request_id: string;
  count: number;
}

interface FormattedData {
  id: string;
  color: string;
  data: Array<{
    x: string; // Formatted date
    y: number; // Close price
  }>;
}

interface TickerResults {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik: string;
  composite_figi: string;
  share_class_figi: string;
  market_cap: number;
  phone_number: string;
  address: {
    address1: string;
    city: string;
    state: string;
    postal_code: string;
  };
  description: string;
  sic_code: string;
  sic_description: string;
  ticker_root: string;
  homepage_url: string;
  total_employees: number;
  list_date: string;
  branding: {
    logo_url: string;
    icon_url: string;
  };
  share_class_shares_outstanding: number;
  weighted_shares_outstanding: number;
  round_lot: number;
}

interface TickerData {
  request_id: string;
  results: TickerResults[];
  status: string;
}

interface LoaderData {
  chartData: ChartData;
  tickerData: TickerData;
}

function transformData(chartData: ChartData) {
  // Only for test purposes
  const type = "D";
  if (!chartData || !chartData.results) {
    return [];
  }

  const transformedData: FormattedData[] = [
    {
      id: chartData.ticker || "unknown",
      color: "hsl(16, 70%, 50%)",
      data: chartData.results.map((result) => ({
        x: setDate(result.t, type), // Convert timestamp to required format
        y: result.c,
      })),
    },
  ];

  return transformedData;
}

function setDate(ts: number, type: string): string {
  const date = new Date(ts);

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

  switch (type.toUpperCase()) {
    case "D":
      return date.toLocaleString("en-US", timeOnly);

    case "W":
    case "M":
      return date.toLocaleString("en-US", dayAndTime);

    case "3M":
    case "YTD":
    case "Y":
    case "5Y":
      return date.toLocaleString("en-US", dateOnly);

    default:
      throw new Error(`Unsupported chart type: ${type}`);
  }
}

function randomTicker() {
  return etfList[Math.floor(Math.random() * etfList.length)];
}

type CurrentSlice = {
  currentSlice: SliceTooltipProps["slice"];
};

function ActivePoint({
  currentSlice,
  ...props
}: CustomLayerProps & CurrentSlice) {
  const theme = useTheme();

  return (
    <g>
      {currentSlice?.points.map((point) => (
        <DotsItem
          key={point.id}
          x={point.x}
          y={point.y}
          datum={point.data}
          symbol={props.pointSymbol}
          size={12}
          color={point.borderColor}
          borderWidth={props.pointBorderWidth}
          borderColor={point.color}
          label={point.label}
          labelYOffset={props.pointLabelYOffset}
          theme={theme}
        />
      ))}
    </g>
  );
}

export default function TickerTest() {
  const { chartData, tickerData } = useLoaderData() as LoaderData;
  const transformedData = chartData ? transformData(chartData) : [];

  return (
    <div className="bg-slate-900 m-5">
      <div className="flex flex-col items-center">
        <h1 className="my-5 text-2xl font-bold">Index data retriever</h1>
        <div className="space-y-3">
          <Form method="get" className="flex flex-col items-center space-y-3">
            <input
              className="bg-slate-100 min-w-20 text-black p-2"
              placeholder="VOO"
              name="ticker"
            ></input>
            <button
              type="submit"
              className="bg-emerald-400 hover:bg-emerald-700 text-white py-2 px-12 rounded"
            >
              Search
            </button>
            <Button />
          </Form>
        </div>
      </div>

      <div className="mt-5">
        {transformedData.length > 0 ? (
          <div id="container" className="h-auto">
            <div className="my-3" id="titles">
              <h2 className="text-white font-semibold text-xl">
                {chartData?.ticker}
              </h2>
              <h3 className="text-white font-semibold text-m">
                {tickerData?.results[0].name}
              </h3>
            </div>
            <div id="subcontainer" style={{ height: "60vh" }}>
              <ResponsiveLine
                data={transformedData}
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
                colors={{ scheme: "nivo" }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
                enablePoints={false}
                enableGridX={false}
                enableGridY={false}
                theme={nivoTheme}
                // Interactivity
                isInteractive={true}
                enableSlices="x"
                enableCrosshair={true}
                enableTouchCrosshair={true}
                animate={false}
                //Tooltip to only show the obj.c value
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
                        <p style={{ fontSize: "0.8rem" }}>
                          {slice.points[0].data.xFormatted}
                        </p>
                      </div>
                      <div>
                        <strong style={{ fontSize: "1rem" }}>
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
          <p className="text-white">
            No data available. Please enter a ticker and search.
          </p>
        )}
      </div>
    </div>
  );
}

const Button = () => {
  const submit = useSubmit();

  const handleClick = () => {
    const randomTick = randomTicker();
    const formData = new FormData();
    formData.append("ticker", randomTick);
    submit(formData, { method: "get" });
  };

  return (
    <button
      title="Random ETF"
      type="button"
      onClick={handleClick}
      className="group cursor-pointer outline-none hover:rotate-90 duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50px"
        height="50px"
        viewBox="0 0 20 20"
        transform="scale(0.85)"
        className="stroke-emerald-400 fill-none group-hover:fill-teal-800 group-active:stroke-teal-200 group-active:fill-teal-600 group-active:duration-0 duration-300 rounded-md"
      >
        <path
          fillRule="evenodd"
          d="M10 8.105a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM18 3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V3zm2-1v16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2zM6 8.105a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm8-8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm2 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
        ></path>
      </svg>
    </button>
  );
};

// Temp Nivo theming object
// You can pass this object to the `theme` property
const nivoTheme = {
  background: "white",
  text: {
    fontSize: 11,
    fill: "#333333",
    outlineWidth: 0,
    outlineColor: "transparent",
  },
  axis: {
    domain: {
      line: {
        stroke: "#777777",
        strokeWidth: 1,
      },
    },
    legend: {
      text: {
        fontSize: 12,
        fill: "#333333",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
    ticks: {
      line: {
        stroke: "#777777",
        strokeWidth: 1,
      },
      text: {
        fontSize: 11,
        fill: "#ffffff",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
  },
  grid: {
    line: {
      stroke: "#dddddd",
      strokeWidth: 1,
    },
  },
  legends: {
    title: {
      text: {
        fontSize: 11,
        fill: "#333333",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
    text: {
      fontSize: 11,
      fill: "#ffffff",
      outlineWidth: 0,
      outlineColor: "transparent",
    },
    ticks: {
      line: {},
      text: {
        fontSize: 10,
        fill: "#ffffff",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
  },
  annotations: {
    text: {
      fontSize: 13,
      fill: "#ffffff",
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    link: {
      stroke: "#000000",
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    outline: {
      stroke: "#000000",
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    symbol: {
      fill: "#000000",
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
  },
  tooltip: {
    wrapper: {},
    container: {
      background: "#ffffff",
      color: "#333333",
      fontSize: 12,
    },
    basic: {},
    chip: {},
    table: {},
    tableCell: {},
    tableCellValue: {},
  },
  crosshair: {
    line: {
      stroke: "#333333",
      strokeWidth: 1,
      strokeOpacity: 1,
      strokeDasharray: "0",
    },
  },
};
