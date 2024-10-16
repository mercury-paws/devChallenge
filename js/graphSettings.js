import { drawGraph } from "./drawTheGraph.js";
import { setPalette, generateColors } from "./colorPalette.js";
{
}
const isYear = (key) => /^\d{4}$/.test(key);
const graphSettings = document.querySelector(".graphSettings");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

export const appendGraphSettings = (keys, selectedGraph, sheetData) => {
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
      console.log("No settings for the selected graph.");
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
          <input type="radio" id="lineGraphx-${key}" name="xAxis" value="${key}" required />
      </label>`
    );

    document.getElementById("y-axis-options").insertAdjacentHTML(
      "beforeend",
      `<label for="lineGraphy-${key}" style="margin: 5px 0;">${key}
          <input type="radio" id="lineGraphy-${key}" name="yAxis" value="${key}" required />
      </label>`
    );
  });

  const xAxisRadioList = document.querySelectorAll(`input[name=xAxis]`);
  const yAxisRadioList = document.querySelectorAll(`input[name=yAxis]`);

  const disableYearRadiosInYGroup = () => {
    yAxisRadioList.forEach((radio) => {
      if (radio.value.toLowerCase().includes("year")) {
        radio.disabled = true;
      }
    });
  };

  disableYearRadiosInYGroup();

  const disableMatchingRadio = (group, value, disable) => {
    group.forEach((radio) => {
      if (radio.value === value) {
        radio.disabled = disable;
      } else {
        radio.disabled = false; // Enable other radios
      }
    });
    if (group === yAxisRadioList) {
      disableYearRadiosInYGroup();
    }
  };

  // Attach event listeners to Group 1 radios
  xAxisRadioList.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const selectedValue = e.target.value;

      // Disable the corresponding radio in Group 2
      disableMatchingRadio(yAxisRadioList, selectedValue, true);
      let colorset = setPalette("");
      const yData = Object.values(sheetData);
      const count = Object.keys(yData[0]).length;
      console.log("count:", count);
      const colors = generateColors(count, colorset);
      console.log("colors:", colors);
      drawGraph(graphType, sheetData, colors);
    });
  });

  yAxisRadioList.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const selectedValue = e.target.value;

      // Disable the corresponding radio in Group 1
      disableMatchingRadio(xAxisRadioList, selectedValue, true);
      let colorset = setPalette("");
      const yData = Object.values(sheetData);
      const count = Object.keys(yData[0]).length;
      console.log("count:", count);
      const colors = generateColors(count, colorset);
      console.log("colors:", colors);
      drawGraph(graphType, sheetData, colors);
    });
  });

  document.getElementById("scheme1").addEventListener("click", () => {
    let colorset = setPalette("scheme1");
    console.log("colorset.colors:", colorset.colors);
    // const count = Object.keys(sheetData).length;
    const yData = Object.values(sheetData);
    const count = Object.keys(yData[0]).length;
    console.log("count:", count);
    const colors = generateColors(count, colorset);
    console.log("colors:", colors);
    drawGraph(graphType, sheetData, colors);
  });

  document.getElementById("scheme2").addEventListener("click", () => {
    let colorset = setPalette("scheme2");
    const yData = Object.values(sheetData);
    const count = Object.keys(yData[0]).length;
    console.log("count:", count);
    const colors = generateColors(count, colorset);
    drawGraph(graphType, sheetData, colors);
  });

  document.getElementById("scheme3").addEventListener("click", () => {
    let colorset = setPalette("scheme3");
    const yData = Object.values(sheetData);
    const count = Object.keys(yData[0]).length;
    console.log("count:", count);
    const colors = generateColors(count, colorset);
    drawGraph(graphType, sheetData, colors);
  });

  // xAxisRadioList.forEach((radio) => {
  //   radio.addEventListener("change", () => drawGraph(graphType, sheetData));
  // });

  // yAxisRadioList.forEach((radio) => {
  //   radio.addEventListener("change", () => drawGraph(graphType, sheetData));
  // });
};
