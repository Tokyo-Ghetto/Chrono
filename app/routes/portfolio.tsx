import { json, LoaderFunction } from "@remix-run/node";
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
} from "lucide-react";

interface LoaderData {
  holdings: PortfolioHolding[];
  summary: {
    total_portfolio_value: number;
    total_gain_loss: number;
    total_gain_loss_percentage: number;
  };
}

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    return json({ message: "Unauthorized" }, { status: 401 });
  }

  const [holdings, summary] = await Promise.all([
    getPortfolioHoldings(userId),
    getPortfolioSummary(userId),
  ]);

  return json({ holdings, summary });
};

export default function Portfolio() {
  const { holdings, summary } = useLoaderData<LoaderData>();

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
    <div className="container mx-auto py-6 space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
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

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Holdings</CardTitle>
          <CardDescription>
            A detailed view of your ETF investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Avg Cost</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">Return</TableHead>
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
