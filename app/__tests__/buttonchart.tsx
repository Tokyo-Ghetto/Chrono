/* eslint-disable @typescript-eslint/no-unused-vars */
import { ResponsiveLine } from "@nivo/line";
import { useEffect, useState } from "react";
import { LoaderFunction, json } from "@remix-run/node";
import * as dotenv from "dotenv";
import { useLoaderData } from "@remix-run/react";

// dotenv.config();

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const ticker = url.searchParams.get("ticker");

  if (!ticker) {
    return json({ error: "Ticker is required" }, { status: 400 });
  }

  const key = process.env.POLY_API_KEY;
  const mult = 1;
  const timespan = "week";
  const datefrom = "2024-01-01";
  const dateto = "2024-06-21";
  const adj = true;

  const response = await fetch(
    `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${mult}/${timespan}/${datefrom}/${dateto}?adjusted=${adj}&sort=asc&apiKey=${key}`
  );
  const data = await response.json();

  return json(data);
};

interface ApiData {
  ticker?: string;
  results?: Array<{
    t: number;
    c: number;
  }>;
  error?: string;
}

function transformData(apiData: ApiData) {
  if (!apiData || !apiData.results) {
    return [];
  }

  const transformedData = [
    {
      id: apiData.ticker || "unknown", // Ensure id is always a string
      color: "hsl(16, 70%, 50%)",
      data: apiData.results.map((result) => ({
        x: new Date(result.t).toLocaleDateString(), // Convert timestamp to normal date
        y: result.c,
      })),
    },
  ];

  return transformedData;
}

function getTicker(data: { id: string }[]) {
  const x = data.map((data) => data.id);
  return x;
}

export default function ButtonChart() {
  const [status, setStatus] = useState("hidden");
  const toggle = () => {
    setStatus(status === "hidden" ? "displayed" : "hidden");
  };

  //   const data = useLoaderData<ApiData>();
  //   const chartData = transformData(data);

  return (
    <div id="main" className="bg-slate-900 h-screen w-screen">
      <div id="container" className="h-full w-full">
        <div id="form" className="flex flex-col items-center">
          <h1>Index data visualization</h1>
          <h1>{getTicker(sample)}</h1>
          {/* The button's content should be "Show" or "Hide" based on state */}
          <button onClick={toggle} className="bg-green-300 min-w-3 py-1 px-5">
            {status === "hidden" ? "Show" : "Hide"}
          </button>
        </div>
        {/* The div below should only be displayed if state is set as displayed */}
        <div
          id="chart-container"
          className={`h-3/4 w-3/4 ${status === "hidden" ? "hidden" : "block"}`}
        >
          <div id="chart" style={{ height: "50vh", width: "80vw" }}>
            <ResponsiveLine
              data={sample}
              margin={{ top: 15, right: 110, bottom: 50, left: 60 }}
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
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Date",
                legendOffset: 36,
                legendPosition: "middle",
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Close Price",
                legendOffset: -40,
                legendPosition: "middle",
              }}
              colors={{ scheme: "nivo" }}
              pointSize={10}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabelYOffset={-12}
              useMesh={true}
              enablePoints={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const sample = [
  {
    id: "QQQ",
    color: "hsl(16, 70%, 50%)",
    data: [
      {
        x: "12/31/2023",
        y: 396.75,
      },
      {
        x: "1/7/2024",
        y: 409.56,
      },
      {
        x: "1/14/2024",
        y: 421.18,
      },
      {
        x: "1/21/2024",
        y: 423.81,
      },
      {
        x: "1/28/2024",
        y: 429.01,
      },
      {
        x: "2/4/2024",
        y: 437.05,
      },
      {
        x: "2/11/2024",
        y: 430.57,
      },
      {
        x: "2/18/2024",
        y: 436.78,
      },
      {
        x: "2/25/2024",
        y: 445.61,
      },
      {
        x: "3/3/2024",
        y: 439.02,
      },
      {
        x: "3/10/2024",
        y: 433.92,
      },
      {
        x: "3/17/2024",
        y: 446.38,
      },
      {
        x: "3/24/2024",
        y: 444.01,
      },
      {
        x: "3/31/2024",
        y: 440.47,
      },
      {
        x: "4/7/2024",
        y: 438.27,
      },
      {
        x: "4/14/2024",
        y: 414.65,
      },
      {
        x: "4/21/2024",
        y: 431,
      },
      {
        x: "4/28/2024",
        y: 435.48,
      },
      {
        x: "5/5/2024",
        y: 442.06,
      },
      {
        x: "5/12/2024",
        y: 451.76,
      },
      {
        x: "5/19/2024",
        y: 457.95,
      },
      {
        x: "5/26/2024",
        y: 450.71,
      },
      {
        x: "6/2/2024",
        y: 462.96,
      },
      {
        x: "6/9/2024",
        y: 479.19,
      },
      {
        x: "6/16/2024",
        y: 480.18,
      },
    ],
  },
];
