import { appendGraphSettings } from "./graphSettings.js";

const graphTypeForm = document.querySelector(".graphTypeForm");

let currentKeys = [];

export const selectGraph = (keys) => {
  currentKeys = keys;
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

  appendGraphSettings(currentKeys, selectedOption.value);
};

graphTypeForm.addEventListener("change", () => {
  selectGraph(currentKeys);
});
