export function formatPrice(price: number | string): string {
  // Convert to number if it's a string, then format
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  // Check if number is valid
  if (isNaN(numericPrice)) {
    return "0.00";
  }

  return numericPrice.toFixed(2);
}
