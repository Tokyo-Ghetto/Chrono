// Script created to remove duplicates from a JSON file containing ETF data

import fs from "fs";

const jsonData = JSON.parse(fs.readFileSync("xnys_data.json", "utf-8"));
console.log(jsonData);

const uniqueTickers = {};

jsonData.forEach((entry) => {
  const ticker = entry.ticker;

  // If the ticker is not in the uniqueTickers object, add it
  if (!uniqueTickers[ticker]) {
    uniqueTickers[ticker] = entry;
  } else {
    // If the ticker is already there, compare the objects
    // Keep the one with more properties (or the one with 'cik', etc.)
    const currentEntry = uniqueTickers[ticker];
    const currentProperties = Object.keys(currentEntry).length;
    const newProperties = Object.keys(entry).length;

    if (newProperties < currentProperties) {
      uniqueTickers[ticker] = entry;
    }
  }
});

const uniqueData = Object.values(uniqueTickers);

// Write the filtered data back to a new JSON file
fs.writeFileSync("xnys_clean.json", JSON.stringify(uniqueData, null, 2));

console.log("Duplicates removed, saved to unique_data.json");
