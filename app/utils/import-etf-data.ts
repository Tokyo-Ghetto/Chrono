import { createETFTable } from "../db/schema.server";
import { importETFData } from "../db/migrations/import-etf-data.server";

async function main() {
  try {
    await createETFTable();
    await importETFData();
    process.exit(0);
  } catch (error) {
    console.error("Error in main execution:", error);
    process.exit(1);
  }
}

main();
