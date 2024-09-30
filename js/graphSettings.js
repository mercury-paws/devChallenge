import { drawGraph } from "./drawTheGraph.js";

const graphSettings = document.querySelector(".graphSettings");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

export const appendGraphSettings = (keys, selectedGraph, sheetData) => {
  event.preventDefault();

  graphSettings.textContent = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch (selectedGraph) {
    case "lineGraph":
      axisSelection(keys, "lineGraph", sheetData);
      break;
    case "barChart":
      axisSelection(keys, "barChart", sheetData);
      break;
    case "pieChart":
      axisSelection(keys, "pieChart", sheetData);
      break;
    default:
      console.log("no settings for the graph");
  }
};

const axisSelection = (keys, graphType, sheetData) => {
  ["x", "y"].forEach((line) => {
    graphSettings.insertAdjacentHTML(
      "beforeend",
      `<p>Select a value for ${line} axis:</p>`
    );

    keys.forEach((key) => {
      graphSettings.insertAdjacentHTML(
        "beforeend",
        `<label for="lineGraph${line}-${key}">${key}</label>
    <input type="radio" id="lineGraph${line}-${key}" name="${line}Axis" required /> <br />`
      );
    });
  });

  const xAxisRadioList = document.querySelectorAll(`input[name=xAxis]`);
  const yAxisRadioList = document.querySelectorAll(`input[name=yAxis]`);

  xAxisRadioList.forEach((radio) => {
    radio.addEventListener("change", () => drawGraph(graphType, sheetData));
  });

  yAxisRadioList.forEach((radio) => {
    radio.addEventListener("change", () => drawGraph(graphType, sheetData));
  });
  console.log("Calling drawGraph with:", graphType, sheetData);
};
