export function formatPrice(price: number | string): string {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    return "0.00";
  }

  return numericPrice.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}`;
};

export const parseCurrencyInput = (value: string): string => {
  const sanitized = value.replace(/[^0-9.-]/g, "");

  const parts = sanitized.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts.slice(1).join("");
  }

  return sanitized;
};

export const formatPercentage = (value: number): string => {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
};

export const parsePercentageInput = (value: string): string => {
  const sanitized = value.replace(/[^0-9.-]/g, "");

  const parts = sanitized.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts.slice(1).join("");
  }

  return sanitized;
};
