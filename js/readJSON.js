import { displayPreview } from "./displayPreview.js";
import { selectGraph } from "./selectGraph.js";
export const readJSON = (file) => {
  const reader = new FileReader();

  reader.onload = function (event) {
    const jsonData = JSON.parse(event.target.result);
    selectGraph(Object.keys(jsonData[0]), jsonData);
    displayPreview(jsonData);
  };

  reader.readAsText(file);
};
