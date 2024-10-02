import { displayPreview } from "./displayPreview.js";
import { selectGraph } from "./selectGraph.js";

export const readTableData = (textData) => {
  const rows = textData
    .trim()
    .split(/\s+/)
    .map((row) => row.trim());

  if (rows.length === 0) {
    alert("No data to process");
    return;
  }

  const headers = [
    "Year",
    "Diplomatic Missions",
    "International Agreements",
    "Foreign Visits by Officials",
    "Foreign Delegations to Ukraine",
    "Trade Agreements Signed",
    "Trade Agreements Signed",
  ];

  const sheetData = [];

  for (let i = 0; i < rows.length; i += headers.length) {
    const row = rows.slice(i, i + headers.length);
    if (row.length < headers.length) {
      continue;
    }

    const rowObject = {};
    headers.forEach((header, index) => {
      rowObject[header] = row[index];
    });
    sheetData.push(rowObject);
  }

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
