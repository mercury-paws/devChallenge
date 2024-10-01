import { displayPreview } from "./displayPreview.js";
import { selectGraph } from "./selectGraph.js";
export const readCSV = (file) => {
  const reader = new FileReader();

  reader.onload = function (event) {
    const text = event.target.result;
    const rows = text.split("\n").map((row) => row.split(","));

    // Convert rows to an object or any desired format for processing
    const sheetData = rows.map((row) => {
      return {
        // Assuming the first row contains the headers
        key1: row[0],
        key2: row[1],
        // Add more keys as necessary
      };
    });

    console.log(sheetData); // Output the CSV data
    selectGraph(Object.keys(sheetData[0]), sheetData); // Call selectGraph with keys and data
    displayPreview(sheetData);
  };

  reader.readAsText(file); // Read as text for CSV
};
