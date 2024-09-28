import { appendGraphSettings } from "./graphSettings.js";

const graphTypeForm = document.querySelector(".graphTypeForm");

let currentKeys = [];
let currentSheetData = null;

export const selectGraph = (keys, sheetData) => {
  currentKeys = keys;
  currentSheetData = sheetData;
  const selectedOption = document.querySelector(
    "input[name=typeOfGraph]:checked"
  );

  if (!selectedOption) {
    console.log("No graph type selected.");
    return;
  }

  if (!keys || keys.length === 0 || keys === null || keys === undefined) {
    console.log("No keys available for the graph.");
    return;
  }

  appendGraphSettings(currentKeys, selectedOption.value, sheetData);
};

graphTypeForm.addEventListener("change", () => {
  if (!currentSheetData) {
    console.log("Sheet data is missing. Please reload the data.");
    return;
  }
  selectGraph(currentKeys, currentSheetData);
});
