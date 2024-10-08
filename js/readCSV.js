import { displayPreview } from "./displayPreview.js";
import { selectGraph } from "./selectGraph.js";
export const readCSV = (file) => {
  const reader = new FileReader();

  reader.onload = function (event) {
    const text = event.target.result;
    const rows = text.split("\n").map((row) => row.split(","));

    const sheetData = rows.map((row) => {
      return {
        key1: row[0],
        key2: row[1],
      };
    });

    selectGraph(Object.keys(sheetData[0]), sheetData);
    displayPreview(sheetData);
  };

  reader.readAsText(file);
};
