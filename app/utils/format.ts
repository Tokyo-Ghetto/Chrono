export function formatPrice(price: number | string): string {
  // Convert to number if it's a string, then format
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  // Check if number is valid
  if (isNaN(numericPrice)) {
    return "0.00";
  }

  return numericPrice.toFixed(2);
}

export const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}`;
};

export const parseCurrencyInput = (value: string): string => {
  return value.replace(/[$,]/g, "");
};

export const formatPercentage = (value: number): string => {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
};

export const parsePercentageInput = (value: string): string => {
  const sanitized = value.replace(/[^0-9.-]/g, "");

  // Handle multiple decimal points - keep only the first one
  const parts = sanitized.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts.slice(1).join("");
  }

  return sanitized;
};
