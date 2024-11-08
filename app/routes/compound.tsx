import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import {
  formatCurrency,
  parseCurrencyInput,
  formatPercentage,
  parsePercentageInput,
} from "~/utils/format";
import { Card } from "~/components/ui/card";

const formSchema = z.object({
  initialDeposit: z
    .number()
    .positive({ message: "Amount must be greater than 0." }),
  monthlyDeposit: z
    .number()
    .nonnegative({ message: "Amount cannot be negative." }),
  timePeriod: z
    .number()
    .positive({ message: "Time period must be at least 1 year." }),
  userInterest: z
    .number()
    .positive({ message: "Interest rate must be greater than 0." }),
  compFrequency: z.string(),
  etfTickers: z.array(z.string()).default([]),
});

type CompoundFormValues = z.infer<typeof formSchema>;

const defaultValues: CompoundFormValues = {
  initialDeposit: 15000,
  monthlyDeposit: 0,
  timePeriod: 1,
  userInterest: 0,
  compFrequency: "annual",
  etfTickers: [],
};

interface ETFListProps {
  tickers: string[];
  onRemove: (index: number) => void;
}

const ETFList = ({ tickers, onRemove }: ETFListProps) => (
  <div className="space-y-2">
    {tickers.map((ticker, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-stone-700 p-4 rounded-lg w-full"
      >
        <div className="space-y-1">
          <div className="font-medium text-white">{ticker}</div>
          <div className="text-sm text-stone-300">Placeholder</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-stone-300">
            Avg. Interest Rate: 5.67%
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-stone-400 hover:text-white"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ))}
  </div>
);

interface FocusableInputProps {
  field: ControllerRenderProps<
    CompoundFormValues,
    keyof Pick<
      CompoundFormValues,
      "initialDeposit" | "monthlyDeposit" | "userInterest"
    >
  >;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  formatter: (value: number) => string;
  parser: (value: string) => string;
}

const FocusableInput = ({
  field,
  isFocused,
  setIsFocused,
  formatter,
  parser,
}: FocusableInputProps) => {
  const [inputValue, setInputValue] = useState(field.value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);

    const parsedValue = parser(rawValue);
    if (parsedValue === "") {
      field.onChange(0);
      return;
    }

    const numberValue = parseFloat(parsedValue);
    if (!isNaN(numberValue)) {
      field.onChange(numberValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Reset the input value to the formatted version
    setInputValue(field.value.toString());
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setInputValue(field.value.toString());
    e.target.select();
  };

  return (
    <Input
      {...field}
      type="text"
      inputMode="decimal"
      value={isFocused ? inputValue : formatter(field.value as number)}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
    />
  );
};

export default function Compound() {
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

  const form = useForm<CompoundFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(data: CompoundFormValues) {
    setInitialInvestment(data.initialDeposit);
    setMonthlyContribution(data.monthlyDeposit);
    setAnnualInterestRate(data.userInterest);
    setNumberOfYears(data.timePeriod);
    setSubmitted(true);

    // Optional: Scroll to results
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }

  interface CompoundInterestParams {
    principal: number;
    monthlyContribution: number;
    annualRate: number;
    years: number;
    frequency: string;
  }

  interface CompoundInterestResult {
    futureValue: number;
    totalContributions: number;
    initialAmount: number;
  }

  function calculateCompoundInterest({
    principal,
    monthlyContribution,
    annualRate,
    years,
    frequency,
  }: CompoundInterestParams): CompoundInterestResult {
    const frequencyMap: Record<string, number> = {
      annual: 1,
      semiannual: 2,
      quarter: 4,
      month: 12,
      day: 365,
    };

    const n = frequencyMap[frequency];
    const r = annualRate / 100;

    // Calculate future value of initial principal
    const principalFV = principal * Math.pow(1 + r / n, n * years);

    // Calculate future value of monthly contributions
    let contributionFV = 0;
    if (monthlyContribution > 0) {
      contributionFV =
        monthlyContribution *
        12 *
        ((Math.pow(1 + r / n, n * years) - 1) / (r / n));
    }

    // Calculate total contributions
    const totalContributions = principal + monthlyContribution * 12 * years;

    return {
      futureValue: principalFV + contributionFV,
      totalContributions,
      initialAmount: principal,
    };
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
    form.setValue(
      "etfTickers",
      currentTickers.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="m-8 space-y-8 bg-stone-600 p-4 rounded-xl"
        >
          <FormField
            control={form.control}
            name="initialDeposit"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
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
              <FormItem>
                <FormLabel>Years to Grow</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
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
              <FormItem>
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
              <FormItem>
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
              />
            )}

            {showEtfInput ? (
              <div className="flex gap-2 w-full">
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
                <Button type="button" onClick={addEtf}>
                  Add
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEtfInput(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEtfInput(true)}
              >
                Add ETF
              </Button>
            )}
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {submitted && (
        <div className="flex flex-col items-center justify-start h-96">
          <div className="text-2xl font-bold text-white">
            Compound Calculator
          </div>
          <div className="text-stone-300">
            You can find the results of your compound interest calculation
            below.
          </div>

          <Card className="w-full p-4 mt-4 max-w-64">
            <div className="text-2xl font-bold text-white">Year 0</div>
            <div className="text-stone-300">
              Total Contributions: {formatCurrency(initialInvestment)}
            </div>
            <div className="text-stone-300">
              Future Value: {formatCurrency(initialInvestment)}
            </div>
          </Card>

          <Card className="w-full p-4 mt-4 max-w-64">
            {/* Use the calculation function for final year */}
            {(() => {
              const result = calculateCompoundInterest({
                principal: initialInvestment,
                monthlyContribution: monthlyContribution,
                annualRate: annualInterestRate,
                years: numberOfYears,
                frequency: form.getValues("compFrequency"),
              });

              return (
                <>
                  <div className="text-2xl font-bold text-white">
                    Year {numberOfYears}
                  </div>
                  <div className="text-stone-300">
                    Total Contributions:{" "}
                    {formatCurrency(result.totalContributions)}
                  </div>
                  <div className="text-stone-300">
                    Future Value: {formatCurrency(result.futureValue)}
                  </div>
                  <div className="text-stone-300 mt-2 text-sm">
                    Total Earnings:{" "}
                    {formatCurrency(
                      result.futureValue - result.totalContributions
                    )}
                  </div>
                </>
              );
            })()}
          </Card>
        </div>
      )}
    </div>
  );
}
