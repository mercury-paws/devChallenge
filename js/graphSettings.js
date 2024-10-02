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
  // Set up the container for axis options
  graphSettings.insertAdjacentHTML(
    "beforeend",
    `<div class="axis-selection-container" style="display: flex; gap: 20px; margin-bottom: 20px;">
      <div class="x-axis-section">
        <p style="margin-right: 10px;">Select a value for x axis:</p>
        <div id="x-axis-options" style="display: flex; flex-direction: column; gap: 5px;"></div>
      </div>
      <div class="y-axis-section">
        <p style="margin-right: 10px;">Select a value for y axis:</p>
        <div id="y-axis-options" style="display: flex; flex-direction: column; gap: 5px;"></div>
      </div>
    </div>`
  );

  // Append options for X and Y axis separately
  keys.forEach((key) => {
    document.getElementById("x-axis-options").insertAdjacentHTML(
      "beforeend",
      `<label for="lineGraphx-${key}" style="margin: 5px 0;">${key}
          <input type="radio" id="lineGraphx-${key}" name="xAxis" required />
      </label>`
    );

    document.getElementById("y-axis-options").insertAdjacentHTML(
      "beforeend",
      `<label for="lineGraphy-${key}" style="margin: 5px 0;">${key}
          <input type="radio" id="lineGraphy-${key}" name="yAxis" required />
      </label>`
    );
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
