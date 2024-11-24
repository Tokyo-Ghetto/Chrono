import { json, type LoaderFunction } from "@remix-run/node";
import { getETFByTicker } from "~/models/etf.server";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { nivoTheme } from "~/components/chart/ChartTheme";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { useState, useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ETFList } from "~/components/compound/ETFList";
import { FocusableInput } from "~/components/compound/FocusableInput";
import { formSchema, CompoundFormValues, TickerReturn } from "~/types/compound";
import { defaultValues, calculateCompoundInterest } from "~/utils/compound";
import {
  formatCurrency,
  parseCurrencyInput,
  formatPercentage,
  parsePercentageInput,
} from "~/utils/format";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface LoaderData {
  etfData: Record<string, string>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const tickers =
    url.searchParams.get("tickers")?.split(",").filter(Boolean) || [];

  if (tickers.length === 0) {
    return json<LoaderData>({ etfData: {} });
  }

  const etfDataPromises = tickers.map(async (ticker) => {
    const data = await getETFByTicker(ticker);
    return {
      ticker,
      name: data?.name || null,
    };
  });

  const etfDataResults = await Promise.all(etfDataPromises);
  const etfData = etfDataResults.reduce((acc, { ticker, name }) => {
    if (name) {
      acc[ticker] = name;
    }
    return acc;
  }, {} as Record<string, string>);

  return json<LoaderData>({ etfData });
};

export default function Compound() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showEtfInput, setShowEtfInput] = useState(false);
  const [currentEtf, setCurrentEtf] = useState("");
  const [isInitialDepositFocused, setIsInitialDepositFocused] = useState(false);
  const [isMonthlyDepositFocused, setIsMonthlyDepositFocused] = useState(false);
  const [isInterestRateFocused, setIsInterestRateFocused] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [initialInvestment, setInitialInvestment] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [annualInterestRate, setAnnualInterestRate] = useState(0);
  const [numberOfYears, setNumberOfYears] = useState(0);
  const [etfReturns, setEtfReturns] = useState<TickerReturn[]>([]);

  const form = useForm<CompoundFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      etfTickers: searchParams.get("tickers")?.split(",").filter(Boolean) || [],
    },
  });

  const handleEtfReturnsUpdate = useCallback((returns: TickerReturn[]) => {
    setEtfReturns((prev) => {
      const existingTickers = new Set(prev.map((p) => p.ticker));
      const newReturns = returns.filter((r) => !existingTickers.has(r.ticker));
      return [...prev, ...newReturns];
    });
  }, []);

  function onSubmit(data: CompoundFormValues) {
    setInitialInvestment(data.initialDeposit);
    setMonthlyContribution(data.monthlyDeposit);
    setAnnualInterestRate(data.userInterest);
    setNumberOfYears(data.timePeriod);
    setSubmitted(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function generateChartData() {
    const data = [];
    const futureValueData = [];

    // Calculate future value with user-provided interest rate
    for (let year = 0; year <= numberOfYears; year++) {
      const result = calculateCompoundInterest({
        principal: initialInvestment,
        monthlyContribution: monthlyContribution,
        annualRate: annualInterestRate,
        years: year,
        frequency: form.getValues("compFrequency"),
      });

      futureValueData.push({ x: year, y: result.futureValue });
    }

    data.push({
      id: `User (${annualInterestRate.toFixed(2)}%)`,
      color: "#3b82f6",
      data: futureValueData,
    });

    // Add lines for each ETF using their 5-year returns
    etfReturns.forEach((etf) => {
      if (etf.returns !== null) {
        const etfData = [];
        for (let year = 0; year <= numberOfYears; year++) {
          const result = calculateCompoundInterest({
            principal: initialInvestment,
            monthlyContribution: monthlyContribution,
            annualRate: etf.returns,
            years: year,
            frequency: form.getValues("compFrequency"),
          });

          etfData.push({ x: year, y: result.futureValue });
        }

        data.push({
          id: `${etf.ticker} (${etf.returns.toFixed(2)}%)`,
          data: etfData,
        });
      }
    });

    return data;
  }

  const addEtf = () => {
    if (currentEtf.trim()) {
      const currentTickers = form.getValues("etfTickers");
      form.setValue("etfTickers", [
        ...currentTickers,
        currentEtf.trim().toUpperCase(),
      ]);
      setCurrentEtf("");
      setShowEtfInput(false);
    }
  };

  const removeEtf = (index: number) => {
    const currentTickers = form.getValues("etfTickers");
    const deletedTicker = currentTickers[index];
    form.setValue(
      "etfTickers",
      currentTickers.filter((_, i) => i !== index)
    );
    setEtfReturns((prev) => prev.filter((etf) => etf.ticker !== deletedTicker));
  };

  const etfTickers = form.watch("etfTickers");

  useEffect(() => {
    const tickers = etfTickers;
    if (tickers.length > 0) {
      navigate(`?tickers=${tickers.join(",")}`, { replace: true });
    } else {
      navigate("", { replace: true });
    }
  }, [etfTickers, navigate]);

  return (
    <div className="flex flex-col lg:flex-row m-4 sm:m-8 p-2 sm:p-4 space-y-6 lg:space-y-0 lg:space-x-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="
            bg-stone-600 rounded-xl 
            w-full lg:w-2/5 
            space-y-6 sm:space-y-8 
            p-3 sm:p-4
          "
        >
          <FormField
            control={form.control}
            name="initialDeposit"
            render={({ field }) => (
              <FormItem className="space-y-2 sm:space-y-3">
                <FormLabel>Initial Deposit</FormLabel>
                <FormControl>
                  <FocusableInput
                    field={field}
                    isFocused={isInitialDepositFocused}
                    setIsFocused={setIsInitialDepositFocused}
                    formatter={formatCurrency}
                    parser={parseCurrencyInput}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthlyDeposit"
            render={({ field }) => (
              <FormItem className="space-y-2 sm:space-y-3">
                <FormLabel>Monthly Deposit Amount</FormLabel>
                <FormControl>
                  <FocusableInput
                    field={field}
                    isFocused={isMonthlyDepositFocused}
                    setIsFocused={setIsMonthlyDepositFocused}
                    formatter={formatCurrency}
                    parser={parseCurrencyInput}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timePeriod"
            render={({ field }) => (
              <FormItem className="space-y-2 sm:space-y-3">
                <FormLabel>Years to Grow</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userInterest"
            render={({ field }) => (
              <FormItem className="space-y-2 sm:space-y-3">
                <FormLabel>Interest Rate</FormLabel>
                <FormControl>
                  <FocusableInput
                    field={field}
                    isFocused={isInterestRateFocused}
                    setIsFocused={setIsInterestRateFocused}
                    formatter={formatPercentage}
                    parser={parsePercentageInput}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="compFrequency"
            render={({ field }) => (
              <FormItem className="space-y-2 sm:space-y-3">
                <FormLabel>Compound Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select compound frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="annual">Annually</SelectItem>
                    <SelectItem value="semiannual">Semiannually</SelectItem>
                    <SelectItem value="quarter">Quarterly</SelectItem>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="day">Daily</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            {form.watch("etfTickers").length > 0 && (
              <ETFList
                tickers={form.watch("etfTickers")}
                onRemove={removeEtf}
                onReturnsUpdate={handleEtfReturnsUpdate}
              />
            )}

            {showEtfInput ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Input
                  value={currentEtf}
                  onChange={(e) => setCurrentEtf(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addEtf();
                    }
                  }}
                  placeholder="Enter ETF ticker"
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={addEtf}
                    className="flex-1 sm:flex-none"
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEtfInput(false)}
                    className="flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEtfInput(true)}
                className="w-full sm:w-auto"
              >
                Add ETF
              </Button>
            )}
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>

      <div className="flex flex-col items-center justify-start w-full lg:w-3/5">
        {submitted && (
          <>
            <div className="text-xl sm:text-2xl font-bold text-white text-center">
              Compound Calculator
            </div>
            <div className="text-stone-300 text-center px-4">
              You can find the results of your compound interest calculation
              below.
            </div>

            <Card className="w-full p-2 sm:p-4 mt-4">
              <div className="h-[300px] sm:h-[400px]">
                <ResponsiveLine
                  data={generateChartData()}
                  margin={{
                    top: 50,
                    right: 20,
                    bottom: 50,
                    left: 60,
                    ...(window.innerWidth > 640
                      ? { right: 110, left: 80 }
                      : {}),
                  }}
                  xScale={{ type: "point" }}
                  yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: false,
                    reverse: false,
                  }}
                  yFormat={(value) =>
                    `$${Number(value).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  }
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Years",
                    legendOffset: 36,
                    legendPosition: "middle",
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "US Dollars ($)",
                    legendOffset: -50,
                    legendPosition: "middle",
                    format: (value) =>
                      window.innerWidth > 640
                        ? `$${Number(value).toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}`
                        : `$${Number(value / 1000).toLocaleString()}K`,
                  }}
                  enablePoints={true}
                  pointSize={window.innerWidth > 640 ? 10 : 6}
                  pointColor={{ theme: "background" }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: "serieColor" }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  theme={nivoTheme}
                  legends={[
                    {
                      anchor:
                        window.innerWidth > 640 ? "bottom-right" : "bottom",
                      direction: "column",
                      justify: false,
                      translateX: window.innerWidth > 640 ? 195 : 0,
                      translateY: window.innerWidth > 640 ? 0 : 50,
                      itemsSpacing: 0,
                      itemDirection: "left-to-right",
                      itemWidth: 180,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 12,
                      symbolShape: "circle",
                      symbolBorderColor: "rgba(0, 0, 0, .5)",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemBackground: "rgba(0, 0, 0, .03)",
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]}
                />
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
