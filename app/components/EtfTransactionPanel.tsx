import * as React from "react";
import { DollarSign, Share2 } from "lucide-react";
import { Link, useFetcher } from "@remix-run/react";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { useUser } from "@clerk/remix";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { formatPrice } from "~/utils/format";

interface TransactionPanelProps {
  symbol: string;
  price: number;
}

export function EtfTransactionPanel({ symbol, price }: TransactionPanelProps) {
  const { isLoaded, user } = useUser();
  const [investType, setInvestType] = React.useState<"dollars" | "shares">(
    "shares"
  );
  const [amount, setAmount] = React.useState("");
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [transactionStatus, setTransactionStatus] = React.useState<
    "pending" | "success" | null
  >(null);
  const fetcher = useFetcher();

  const estimatedCost = React.useMemo(() => {
    if (!amount) return 0;
    return investType === "shares" ? Number(amount) * price : Number(amount);
  }, [amount, investType, price]);

  const estimatedShares = React.useMemo(() => {
    if (!amount) return 0;
    return investType === "shares" ? Number(amount) : Number(amount) / price;
  }, [amount, investType, price]);

  const handleInvestTypeChange = (value: "dollars" | "shares") => {
    setInvestType(value);
    setAmount("");
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setShowConfirmDialog(true);
  };

  const handleConfirmTransaction = () => {
    setTransactionStatus("pending");
    fetcher.submit(
      {
        ticker: symbol,
        type: "BUY",
        shares: estimatedShares,
        pricePerShare: price,
        totalAmount: estimatedCost,
      },
      { method: "POST", action: "/api/transaction" }
    );
  };

  React.useEffect(() => {
    if (fetcher.data && fetcher.state === "idle") {
      setTransactionStatus("success");
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <Card className="w-[450px] bg-zinc-900 text-white border-zinc-800">
      <CardHeader className="border-b border-zinc-800">
        <CardTitle className="flex items-center justify-between">
          <span>Buy {symbol}</span>
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <form onSubmit={(e) => e.preventDefault()}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="investType">Invest In</Label>
            <Select value={investType} onValueChange={handleInvestTypeChange}>
              <SelectTrigger
                id="investType"
                className="bg-zinc-900 border-zinc-700"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="shares">Shares</SelectItem>
                <SelectItem value="dollars">Dollars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              {investType === "shares" ? "Shares" : "Amount"}
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-zinc-900 border-zinc-700 pr-10"
              />
              {investType === "dollars" && (
                <DollarSign className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
              )}
            </div>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-zinc-400">Market Price</span>
            <span>${price.toFixed(2)}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-zinc-400">Commissions</span>
            <span>$0.00</span>
          </div>

          <Separator />

          <div className="flex justify-between py-2">
            <span className="text-zinc-400">
              {investType === "shares" ? "Estimated Cost" : "Est. Quantity"}
            </span>
            <span>
              {investType === "shares"
                ? `$${formatPrice(estimatedCost)}`
                : estimatedShares.toFixed(4)}
            </span>
          </div>

          {isLoaded && user ? (
            <Button
              className="w-full bg-neutral-900 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:hover:bg-neutral-50/90"
              size="lg"
              onClick={handleBuyClick}
            >
              Buy
            </Button>
          ) : (
            <div className="text-sm text-zinc-400">
              Sign up for a Chrono brokerage account to buy or sell {symbol}{" "}
              shares commission-free. Other fees may apply. See our{" "}
              <Button
                variant="link"
                className="h-auto p-0 text-sm text-neutral-900 dark:text-neutral-50"
              >
                fee schedule
              </Button>{" "}
              to learn more.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          {!isLoaded || !user ? (
            <>
              <Button
                className="w-full bg-neutral-900 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:hover:bg-neutral-50/90"
                size="lg"
                asChild
              >
                <Link to="/sign-up">Sign Up to Buy</Link>
              </Button>
              <div className="text-center text-xs mt-2">
                <Link
                  to="/sign-in"
                  className="underline text-gray-400 hover:text-gray-500"
                >
                  Already have a Chrono account?
                </Link>
              </div>
            </>
          ) : null}
        </CardFooter>
      </form>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          {transactionStatus === "success" ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Transaction Successful!</AlertDialogTitle>
                <AlertDialogDescription>
                  Your purchase of {estimatedShares.toFixed(4)} shares of{" "}
                  {symbol} has been completed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
                  Close
                </AlertDialogCancel>
                <Link to="/portfolio" className={buttonVariants()}>
                  View Portfolio
                </Link>
              </AlertDialogFooter>
            </>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Transaction</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to purchase {estimatedShares.toFixed(4)} shares
                  of {symbol} for ${formatPrice(estimatedCost)}. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmTransaction}
                  disabled={transactionStatus === "pending"}
                >
                  {transactionStatus === "pending"
                    ? "Processing..."
                    : "Confirm Purchase"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
