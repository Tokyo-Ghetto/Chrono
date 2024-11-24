import { Text, View, StyleSheet, Line, Svg } from "@react-pdf/renderer";
import ReactPDFChart from "react-pdf-charts";
import { Pie, PieChart } from "recharts";

const formatPricePDF = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    color: "#333",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
  },
  subHeader: {
    fontSize: 18,
    color: "#666",
    marginBottom: 5,
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginBottom: 10,
    borderTopWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
    alignItems: "center",
  },
  tableRowFirst: {
    borderTopWidth: 0,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#bfbfbf",
    borderRightStyle: "solid",
  },
  metric: {
    fontSize: 12,
    marginVertical: 3,
  },
  row: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#bfbfbf",
    borderTopStyle: "solid",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  cell: {
    padding: 5,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#bfbfbf",
    borderRightStyle: "solid",
  },
  cellLast: {
    padding: 5,
    fontSize: 10,
  },
  footerText: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 10,
  },
  footerLine: {
    width: "100%",
    marginLeft: 50,
    marginRight: 50,
  },
  headerLine: {
    width: "100%",
    marginBottom: 15,
  },
  leftAlign: {
    textAlign: "left",
  },
});

export const HeaderSection = ({
  userName,
  date,
}: {
  userName: string;
  date: string;
}) => (
  <View style={styles.section}>
    <Text style={[styles.header, styles.headerLine]}>
      Chrono - Portfolio Performance Report
    </Text>
    <Text style={styles.subHeader}>Generated for: {userName}</Text>
    <Text style={styles.metric}>
      Date: {new Date(date).toLocaleDateString()}
    </Text>
    {/* Display time in Eastern Standard Time */}
    <Text style={styles.metric}>
      Time:{" "}
      {new Date(date).toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
      })}{" "}
      {
        new Date(date)
          .toLocaleTimeString("en-US", {
            timeZone: "America/New_York",
            timeZoneName: "short",
          })
          .split(" ")[2]
      }
    </Text>
  </View>
);

export const SummarySection = ({
  summary,
}: {
  summary: {
    totalValue: number;
    totalGainLoss: number;
    totalGainLossPercentage: number;
  };
}) => (
  <View style={styles.section}>
    <Text style={styles.subHeader}>Portfolio Summary</Text>
    <Text style={styles.metric}>
      Total Value: {formatPricePDF(summary.totalValue)}
    </Text>
    <Text style={styles.metric}>
      Total Gain/Loss: {formatPricePDF(summary.totalGainLoss)}
    </Text>
    <Text style={styles.metric}>
      Overall Return: {Number(summary.totalGainLossPercentage).toFixed(2)}%
    </Text>
  </View>
);

type HoldingType = {
  symbol: string;
  name: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercentage: number;
};

type ChartDataItem = {
  name: string;
  value: number;
  fill: string;
};
const chartColors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#a4de6c",
  "#d0ed57",
  "#83a6ed",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
];

// Calculate portfolio percentages and create chart data
const calculateChartData = (
  holdings: HoldingType[],
  summary: { totalValue: number }
): ChartDataItem[] => {
  const totalPortfolioValue = summary.totalValue;

  return holdings.map((holding, index) => ({
    name: holding.symbol,
    value: Number(
      ((holding.totalValue / totalPortfolioValue) * 100).toFixed(2)
    ),
    fill: chartColors[index % chartColors.length], // Cycle through colors if more holdings than colors
  }));
};

export const HoldingsSection = ({ holdings }: { holdings: HoldingType[] }) => (
  <View style={styles.section}>
    <Text style={styles.subHeader}>Holdings Details</Text>
    <View style={styles.table}>
      <View style={[styles.row, styles.leftAlign]}>
        <Text style={[styles.headerText, styles.cell, { width: "15%" }]}>
          Symbol
        </Text>
        <Text style={[styles.headerText, styles.cell, { width: "25%" }]}>
          Name
        </Text>
        <Text style={[styles.headerText, styles.cell, { width: "15%" }]}>
          Shares
        </Text>
        <Text style={[styles.headerText, styles.cell, { width: "15%" }]}>
          Avg Cost
        </Text>
        <Text style={[styles.headerText, styles.cell, { width: "15%" }]}>
          Price
        </Text>
        <Text style={[styles.headerText, styles.cellLast, { width: "15%" }]}>
          Value
        </Text>
      </View>
      {holdings.map((holding, index) => (
        <View key={index} style={[styles.row]}>
          <Text style={[styles.cell, { width: "15%" }]}>{holding.symbol}</Text>
          <Text style={[styles.cell, { width: "25%" }]}>{holding.name}</Text>
          <Text style={[styles.cell, { width: "15%" }]}>
            {Number(holding.shares).toFixed(4)}
          </Text>
          <Text style={[styles.cell, { width: "15%" }]}>
            {formatPricePDF(holding.averageCost)}
          </Text>
          <Text style={[styles.cell, { width: "15%" }]}>
            {formatPricePDF(holding.currentPrice)}
          </Text>
          <Text style={[styles.cellLast, { width: "15%" }]}>
            {formatPricePDF(holding.totalValue)}
          </Text>
        </View>
      ))}
    </View>
  </View>
);

export const ChartSection = ({
  holdings,
  summary,
}: {
  holdings: HoldingType[];
  summary: { totalValue: number };
}) => {
  const chartData = calculateChartData(holdings, summary);
  console.log(chartData);

  return (
    <ReactPDFChart>
      <PieChart width={612} height={300}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={40}
          paddingAngle={3}
          label={({ name, value }) => `${name} (${value}%)`}
        />
        {/* <Legend layout="horizontal" verticalAlign="bottom" align="center" /> */}
      </PieChart>
    </ReactPDFChart>
  );
};

export const FooterSection = () => (
  <View style={styles.section}>
    <View style={{ alignItems: "center" }}>
      <Svg width="1000" height="2" style={styles.footerLine}>
        <Line
          x1="0"
          y1="0"
          x2="1000"
          y2="0"
          strokeWidth={1}
          stroke="rgb(0,0,0)"
        />
      </Svg>
    </View>
    <Text style={styles.footerText}>
      This document is confidential and intended solely for the use of the
      individual or entity to whom it is addressed. Past performance does not
      guarantee future results. All investment values and calculations are
      approximations and may not reflect real-time market conditions. For
      official financial advice, please consult with a qualified financial
      advisor.
    </Text>
  </View>
);
