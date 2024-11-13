import {
  CompoundInterestParams,
  CompoundInterestResult,
} from "~/types/compound";

export const defaultValues = {
  initialDeposit: 0,
  monthlyDeposit: 0,
  timePeriod: 0,
  userInterest: 0,
  compFrequency: "annual",
  etfTickers: [],
};

export function calculateCompoundInterest({
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
