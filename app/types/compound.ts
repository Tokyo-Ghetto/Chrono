import { z } from "zod";

export const formSchema = z.object({
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

export type CompoundFormValues = z.infer<typeof formSchema>;

export interface ETFListProps {
  tickers: string[];
  onRemove: (index: number) => void;
  onReturnsUpdate: (returns: TickerReturn[]) => void;
}

export interface TickerReturn {
  ticker: string;
  returns: number | null;
  isLoading: boolean;
  error?: string;
}

export interface FocusableInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  formatter: (value: number) => string;
  parser: (value: string) => string;
}

export interface CompoundInterestParams {
  principal: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
  frequency: string;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalContributions: number;
  initialAmount: number;
}
