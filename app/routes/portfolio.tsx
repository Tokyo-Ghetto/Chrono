import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getAuth } from "@clerk/remix/ssr.server";
import {
  getPortfolioHoldings,
  getPortfolioSummary,
  type PortfolioHolding,
} from "~/services/portfolio.server";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatPrice } from "~/utils/format";
import {
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  TrendingUp,
  FileDown,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { PortfolioReport } from "~/components/pdf/PortfolioReport";

interface LoaderData {
  holdings: PortfolioHolding[];
  summary: {
    total_portfolio_value: number;
    total_gain_loss: number;
    total_gain_loss_percentage: number;
  };
  userId: string;
}

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect("/sign-in");
  }

  const [holdings, summary] = await Promise.all([
    getPortfolioHoldings(userId),
    getPortfolioSummary(userId),
  ]);

  return Response.json({ holdings, summary, userId });
};

export default function Portfolio() {
  const { holdings, summary, userId } = useLoaderData<LoaderData>();

  const handleDownloadReport = async () => {
    try {
      const response = await fetch(`/api/report/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }
      const reportData = await response.json();

      const doc = <PortfolioReport data={reportData} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `portfolio-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  if (holdings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle>Welcome to Your Portfolio</CardTitle>
            <CardDescription>
              You haven&apos;t purchased any ETF shares yet. Start building your
              investment portfolio today!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/overview">Browse ETFs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Portfolio Value
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${formatPrice(summary.total_portfolio_value)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Gain/Loss
            </CardTitle>
            {summary.total_gain_loss >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                summary.total_gain_loss >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ${formatPrice(summary.total_gain_loss)}
            </div>
            <p
              className={`text-xs ${
                summary.total_gain_loss_percentage >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {Number(summary.total_gain_loss_percentage).toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holdings.length}</div>
            <p className="text-xs text-muted-foreground">Different ETFs</p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Your Holdings</CardTitle>
              <CardDescription>
                A detailed view of your ETF investments
              </CardDescription>
            </div>
            <Button
              onClick={handleDownloadReport}
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <FileDown className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Symbol</TableHead>
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="text-right whitespace-nowrap">
                  Shares
                </TableHead>
                <TableHead className="text-right whitespace-nowrap">
                  Avg Cost
                </TableHead>
                <TableHead className="text-right whitespace-nowrap">
                  Current Price
                </TableHead>
                <TableHead className="text-right whitespace-nowrap">
                  Total Value
                </TableHead>
                <TableHead className="text-right whitespace-nowrap">
                  Gain/Loss
                </TableHead>
                <TableHead className="text-right whitespace-nowrap">
                  Return
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => (
                <TableRow key={holding.ticker}>
                  <TableCell className="font-medium">
                    <Link
                      to={`/etf?ticker=${holding.ticker}`}
                      className="hover:underline"
                    >
                      {holding.ticker}
                    </Link>
                  </TableCell>
                  <TableCell>{holding.name}</TableCell>
                  <TableCell className="text-right">
                    {Number(holding.total_shares).toFixed(4)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(holding.average_cost)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(holding.current_price)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${formatPrice(holding.total_value)}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      holding.total_gain_loss >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    ${formatPrice(holding.total_gain_loss)}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      Number(holding.gain_loss_percentage) >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {Number(holding.gain_loss_percentage).toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
