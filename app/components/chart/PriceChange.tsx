// import { useState } from "react";
import { getChartColorClass } from "~/utils/colors";

export function PriceChangeDisplay({ percentage }: { percentage: number }) {
  const formattedPercentage = percentage.toFixed(2);
  const isPositive = percentage >= 0;
  const colorClass = getChartColorClass(percentage);
  const sign = isPositive ? "+" : "";

  return (
    <span className={`${colorClass} font-semibold ml-2`}>
      {sign}
      {formattedPercentage}%
    </span>
  );
}
