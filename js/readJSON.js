import { displayPreview } from "./displayPreview.js";
import { selectGraph } from "./selectGraph.js";
export const readJSON = (file) => {
  const reader = new FileReader();

  reader.onload = function (event) {
    const jsonData = JSON.parse(event.target.result);

    // Assuming the JSON data is an array of objects
    console.log(jsonData); // Output the JSON data
    selectGraph(Object.keys(jsonData[0]), jsonData); // Call selectGraph with keys and data
    displayPreview(sheetData);
  };

  reader.readAsText(file); // Read as text for JSON
};
