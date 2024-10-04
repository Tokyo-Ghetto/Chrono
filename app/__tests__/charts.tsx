// Disable unused variable error for entire file
/* eslint-disable @typescript-eslint/no-unused-vars */

//While chart does finally show (no details on hover yet),
//  I need to think about what data I'll use on the x-axis.
//In the current example, where I have weekly QQQ data from Jan 1 to June 16 2024,
//  I have 25 different values, and the X values (dates) look way too cluttered.
//Maybe hide the X-axis lines when there's a lot of them,
//  and instead use only the first, last, and a couple of in between dates?
//      Something like Jan 1, Feb 15, April 1, May 15, June 16?
//  Compare to charting of other finance apps

import { ResponsiveLine } from "@nivo/line";

export default function ChartLab() {
  return (
    <div className="bg-gray-100 p-5">
      <h1 className="font-bold text-2xl text-cyan-700 py-3">
        Chart Testing Page
      </h1>
      <div id="container" className="h-auto">
        <h2 className="text-green-900 font-semibold text-xl">
          {getTicker(sampleData)}
        </h2>
        <div id="subcontainer" style={{ height: "60vh" }}>
          <ResponsiveLine
            data={sampleData}
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
  );
}

const sampleData = [
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

// console.log(sampleData.map((x) => x.id));

function getTicker(data) {
  const x = data.map((data) => data.id);
  return x;
}

// const validData = [
//   {
//     color: "hsl(194, 70%, 50%)",
//     data: [
//       {
//         color: "hsl(59, 70%, 50%)",
//         x: "HR",
//         y: 55,
//       },
//       {
//         color: "hsl(138, 70%, 50%)",
//         x: "VC",
//         y: 15,
//       },
//       {
//         color: "hsl(255, 70%, 50%)",
//         x: "VE",
//         y: 29,
//       },
//       {
//         color: "hsl(267, 70%, 50%)",
//         x: "TL",
//         y: 46,
//       },
//       {
//         color: "hsl(8, 70%, 50%)",
//         x: "SY",
//         y: 51,
//       },
//       {
//         color: "hsl(102, 70%, 50%)",
//         x: "WS",
//         y: 47,
//       },
//       {
//         color: "hsl(137, 70%, 50%)",
//         x: "EE",
//         y: 12,
//       },
//       {
//         color: "hsl(208, 70%, 50%)",
//         x: "MM",
//         y: 5,
//       },
//       {
//         color: "hsl(242, 70%, 50%)",
//         x: "ME",
//         y: 46,
//       },
//       {
//         color: "hsl(183, 70%, 50%)",
//         x: "PS",
//         y: 4,
//       },
//       {
//         color: "hsl(66, 70%, 50%)",
//         x: "GR",
//         y: 41,
//       },
//       {
//         color: "hsl(248, 70%, 50%)",
//         x: "ES",
//         y: 48,
//       },
//       {
//         color: "hsl(65, 70%, 50%)",
//         x: "VG",
//         y: 10,
//       },
//       {
//         color: "hsl(122, 70%, 50%)",
//         x: "RW",
//         y: 3,
//       },
//       {
//         color: "hsl(162, 70%, 50%)",
//         x: "CY",
//         y: 35,
//       },
//       {
//         color: "hsl(297, 70%, 50%)",
//         x: "GW",
//         y: 32,
//       },
//       {
//         color: "hsl(180, 70%, 50%)",
//         x: "IN",
//         y: 55,
//       },
//       {
//         color: "hsl(265, 70%, 50%)",
//         x: "FI",
//         y: 6,
//       },
//     ],
//     id: "whisky",
//   },
//   {
//     color: "hsl(100, 70%, 50%)",
//     data: [
//       {
//         color: "hsl(220, 70%, 50%)",
//         x: "HR",
//         y: 18,
//       },
//       {
//         color: "hsl(251, 70%, 50%)",
//         x: "VC",
//         y: 58,
//       },
//       {
//         color: "hsl(325, 70%, 50%)",
//         x: "VE",
//         y: 14,
//       },
//       {
//         color: "hsl(110, 70%, 50%)",
//         x: "TL",
//         y: 34,
//       },
//       {
//         color: "hsl(101, 70%, 50%)",
//         x: "SY",
//         y: 9,
//       },
//       {
//         color: "hsl(24, 70%, 50%)",
//         x: "WS",
//         y: 13,
//       },
//       {
//         color: "hsl(142, 70%, 50%)",
//         x: "EE",
//         y: 11,
//       },
//       {
//         color: "hsl(293, 70%, 50%)",
//         x: "MM",
//         y: 10,
//       },
//       {
//         color: "hsl(172, 70%, 50%)",
//         x: "ME",
//         y: 58,
//       },
//       {
//         color: "hsl(190, 70%, 50%)",
//         x: "PS",
//         y: 50,
//       },
//       {
//         color: "hsl(116, 70%, 50%)",
//         x: "GR",
//         y: 20,
//       },
//       {
//         color: "hsl(28, 70%, 50%)",
//         x: "ES",
//         y: 38,
//       },
//       {
//         color: "hsl(243, 70%, 50%)",
//         x: "VG",
//         y: 10,
//       },
//       {
//         color: "hsl(52, 70%, 50%)",
//         x: "RW",
//         y: 18,
//       },
//       {
//         color: "hsl(207, 70%, 50%)",
//         x: "CY",
//         y: 32,
//       },
//       {
//         color: "hsl(36, 70%, 50%)",
//         x: "GW",
//         y: 8,
//       },
//       {
//         color: "hsl(211, 70%, 50%)",
//         x: "IN",
//         y: 5,
//       },
//       {
//         color: "hsl(321, 70%, 50%)",
//         x: "FI",
//         y: 37,
//       },
//     ],
//     id: "rhum",
//   },
//   {
//     color: "hsl(342, 70%, 50%)",
//     data: [
//       {
//         color: "hsl(342, 70%, 50%)",
//         x: "HR",
//         y: 15,
//       },
//       {
//         color: "hsl(298, 70%, 50%)",
//         x: "VC",
//         y: 48,
//       },
//       {
//         color: "hsl(213, 70%, 50%)",
//         x: "VE",
//         y: 36,
//       },
//       {
//         color: "hsl(49, 70%, 50%)",
//         x: "TL",
//         y: 60,
//       },
//       {
//         color: "hsl(200, 70%, 50%)",
//         x: "SY",
//         y: 33,
//       },
//       {
//         color: "hsl(72, 70%, 50%)",
//         x: "WS",
//         y: 54,
//       },
//       {
//         color: "hsl(359, 70%, 50%)",
//         x: "EE",
//         y: 58,
//       },
//       {
//         color: "hsl(24, 70%, 50%)",
//         x: "MM",
//         y: 37,
//       },
//       {
//         color: "hsl(277, 70%, 50%)",
//         x: "ME",
//         y: 23,
//       },
//       {
//         color: "hsl(123, 70%, 50%)",
//         x: "PS",
//         y: 57,
//       },
//       {
//         color: "hsl(215, 70%, 50%)",
//         x: "GR",
//         y: 28,
//       },
//       {
//         color: "hsl(64, 70%, 50%)",
//         x: "ES",
//         y: 33,
//       },
//       {
//         color: "hsl(252, 70%, 50%)",
//         x: "VG",
//         y: 40,
//       },
//       {
//         color: "hsl(281, 70%, 50%)",
//         x: "RW",
//         y: 16,
//       },
//       {
//         color: "hsl(123, 70%, 50%)",
//         x: "CY",
//         y: 34,
//       },
//       {
//         color: "hsl(191, 70%, 50%)",
//         x: "GW",
//         y: 41,
//       },
//       {
//         color: "hsl(8, 70%, 50%)",
//         x: "IN",
//         y: 54,
//       },
//       {
//         color: "hsl(235, 70%, 50%)",
//         x: "FI",
//         y: 44,
//       },
//     ],
//     id: "gin",
//   },
//   {
//     color: "hsl(222, 70%, 50%)",
//     data: [
//       {
//         color: "hsl(186, 70%, 50%)",
//         x: "HR",
//         y: 36,
//       },
//       {
//         color: "hsl(9, 70%, 50%)",
//         x: "VC",
//         y: 39,
//       },
//       {
//         color: "hsl(28, 70%, 50%)",
//         x: "VE",
//         y: 52,
//       },
//       {
//         color: "hsl(334, 70%, 50%)",
//         x: "TL",
//         y: 40,
//       },
//       {
//         color: "hsl(37, 70%, 50%)",
//         x: "SY",
//         y: 37,
//       },
//       {
//         color: "hsl(231, 70%, 50%)",
//         x: "WS",
//         y: 43,
//       },
//       {
//         color: "hsl(320, 70%, 50%)",
//         x: "EE",
//         y: 57,
//       },
//       {
//         color: "hsl(2, 70%, 50%)",
//         x: "MM",
//         y: 28,
//       },
//       {
//         color: "hsl(192, 70%, 50%)",
//         x: "ME",
//         y: 15,
//       },
//       {
//         color: "hsl(181, 70%, 50%)",
//         x: "PS",
//         y: 50,
//       },
//       {
//         color: "hsl(302, 70%, 50%)",
//         x: "GR",
//         y: 16,
//       },
//       {
//         color: "hsl(306, 70%, 50%)",
//         x: "ES",
//         y: 41,
//       },
//       {
//         color: "hsl(136, 70%, 50%)",
//         x: "VG",
//         y: 6,
//       },
//       {
//         color: "hsl(178, 70%, 50%)",
//         x: "RW",
//         y: 14,
//       },
//       {
//         color: "hsl(173, 70%, 50%)",
//         x: "CY",
//         y: 38,
//       },
//       {
//         color: "hsl(57, 70%, 50%)",
//         x: "GW",
//         y: 9,
//       },
//       {
//         color: "hsl(139, 70%, 50%)",
//         x: "IN",
//         y: 50,
//       },
//       {
//         color: "hsl(267, 70%, 50%)",
//         x: "FI",
//         y: 28,
//       },
//     ],
//     id: "vodka",
//   },
//   {
//     color: "hsl(19, 70%, 50%)",
//     data: [
//       {
//         color: "hsl(346, 70%, 50%)",
//         x: "HR",
//         y: 8,
//       },
//       {
//         color: "hsl(235, 70%, 50%)",
//         x: "VC",
//         y: 17,
//       },
//       {
//         color: "hsl(252, 70%, 50%)",
//         x: "VE",
//         y: 1,
//       },
//       {
//         color: "hsl(346, 70%, 50%)",
//         x: "TL",
//         y: 36,
//       },
//       {
//         color: "hsl(58, 70%, 50%)",
//         x: "SY",
//         y: 43,
//       },
//       {
//         color: "hsl(300, 70%, 50%)",
//         x: "WS",
//         y: 47,
//       },
//       {
//         color: "hsl(122, 70%, 50%)",
//         x: "EE",
//         y: 46,
//       },
//       {
//         color: "hsl(103, 70%, 50%)",
//         x: "MM",
//         y: 13,
//       },
//       {
//         color: "hsl(314, 70%, 50%)",
//         x: "ME",
//         y: 2,
//       },
//       {
//         color: "hsl(4, 70%, 50%)",
//         x: "PS",
//         y: 8,
//       },
//       {
//         color: "hsl(52, 70%, 50%)",
//         x: "GR",
//         y: 58,
//       },
//       {
//         color: "hsl(331, 70%, 50%)",
//         x: "ES",
//         y: 30,
//       },
//       {
//         color: "hsl(333, 70%, 50%)",
//         x: "VG",
//         y: 18,
//       },
//       {
//         color: "hsl(349, 70%, 50%)",
//         x: "RW",
//         y: 59,
//       },
//       {
//         color: "hsl(232, 70%, 50%)",
//         x: "CY",
//         y: 32,
//       },
//       {
//         color: "hsl(58, 70%, 50%)",
//         x: "GW",
//         y: 7,
//       },
//       {
//         color: "hsl(310, 70%, 50%)",
//         x: "IN",
//         y: 59,
//       },
//       {
//         color: "hsl(64, 70%, 50%)",
//         x: "FI",
//         y: 5,
//       },
//     ],
//     id: "cognac",
//   },
// ];

// console.log(JSON.stringify(sampleData));
