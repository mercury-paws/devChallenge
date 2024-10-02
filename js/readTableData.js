import { displayPreview } from "./displayPreview.js";
import { selectGraph } from "./selectGraph.js";

export const readTableData = (textData) => {
  // Split the input data by lines (using newline or space)
  const rows = textData
    .trim()
    .split(/\s+/)
    .map((row) => row.trim())
    .filter((row) => row);

  // Check if there are any rows
  if (rows.length === 0) {
    alert("No data to process");
    return;
  }

  // Extract headers from the first row
  const headers = [
    "Year",
    "Diplomatic Missions",
    "International Agreements",
    "Foreign Visits by Officials",
    "Foreign Delegations to Ukraine",
    "Trade Agreements Signed",
  ];

  // Initialize an array to hold the structured data
  const sheetData = [];

  // Iterate through the data to create objects for each row
  for (let i = 0; i < rows.length; i += headers.length) {
    const row = rows.slice(i, i + headers.length);
    if (row.length < headers.length) {
      // Skip incomplete rows
      continue;
    }

    const rowObject = {};
    headers.forEach((header, index) => {
      rowObject[header] = row[index];
    });
    sheetData.push(rowObject);
  }

  // Check if the data is valid
  if (sheetData.length === 0) {
    alert("No valid data found.");
    return;
  }

  // Data manipulation or further processing
  //   console.log(sheetData);

  selectGraph(headers, sheetData);
  displayPreview(sheetData);
};
///// ///
