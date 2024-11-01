import { createETFCachePrice, createETFCacheChart } from "../db/schema.server";

async function main() {
  try {
    await createETFCachePrice();
    await createETFCacheChart();
    process.exit(0);
  } catch (error) {
    console.error("Error in main execution:", error);
    process.exit(1);
  }
}

main();
