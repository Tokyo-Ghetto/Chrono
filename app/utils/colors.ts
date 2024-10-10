export const CHART_COLORS = {
  POSITIVE: "#22c55e", // Tailwind green-500
  NEGATIVE: "#ef4444", // Tailwind red-500
} as const;

export function getChartColor(percentage: number) {
  return percentage >= 0 ? CHART_COLORS.POSITIVE : CHART_COLORS.NEGATIVE;
}

export function getChartColorClass(percentage: number) {
  return percentage >= 0 ? "text-green-500" : "text-red-500";
}
