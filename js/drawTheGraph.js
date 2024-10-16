import { evaluateData } from "./evaluateData.js";
import { generateColors } from "./colorPalette.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let graphTypeUpdate;
let dataUpdate;
let colorsUpdate;
const canvasHeight = 700;
const yOffset = 50;
const updateCanvasSize = () => {
  canvas.height = canvasHeight;
  canvas.width = window.innerWidth - 50;
};
updateCanvasSize();

window.addEventListener("resize", () => {
  updateCanvasSize();
  drawGraph(graphTypeUpdate, dataUpdate, colorsUpdate);
});

export function drawGraph(graphType, data, colors) {
  graphTypeUpdate = graphType;
  dataUpdate = data;
  colorsUpdate = colors;

  console.log("Inside drawGraph, received data:", dataUpdate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const xAxis = document.querySelector("input[name=xAxis]:checked");
  const yAxis = document.querySelector("input[name=yAxis]:checked");

  if (!xAxis || !yAxis) {
    console.log("Please select both axes before drawing.");

    return;
  }

  let x = xAxis.id.replace("lineGraphx-", "");
  let y = yAxis.id.replace("lineGraphy-", "");

  // Evaluate data based on selected axes
  const evaluatedData = evaluateData(x, y, dataUpdate);

  console.log("Evaluated Data:", evaluatedData);

  // Draw the graph based on the evaluated data
  if (graphType === "lineGraph") {
    drawLineGraph(evaluatedData, x, y, colorsUpdate);
  } else if (graphType === "barChart") {
    drawBarChart(evaluatedData, x, y, colorsUpdate);
  } else if (graphType === "pieChart") {
    drawPieChart(evaluatedData, x, y, colorsUpdate);
  }
}

const normalizeData = (data, canvasSize, padding = 50) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  return data.map(
    (val) => ((val - min) / (max - min)) * (canvasSize - padding) + padding
  );
};

const drawAxes = (xLabels, yLabels, evaluatedData) => {
  const graphHeight = canvas.height - 100;
  const graphWidth = canvas.width - 70;
  const xAxisY = graphHeight - 40 + yOffset;
  const yAxisX = 50;

  // Draw x-axis
  ctx.beginPath();
  ctx.moveTo(0, xAxisY);
  ctx.lineTo(graphWidth, xAxisY);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  // Draw y-axis
  ctx.beginPath();
  ctx.moveTo(yAxisX, yOffset);
  ctx.lineTo(yAxisX, graphHeight + yOffset);
  ctx.stroke();
  ctx.closePath();

  // Draw x-axis ticks and labels
  const xTickSpacing = (graphWidth - 50) / (xLabels.length - 1);
  xLabels.forEach((label, index) => {
    const xPosition = yAxisX + index * xTickSpacing;
    ctx.beginPath();
    ctx.moveTo(xPosition, xAxisY);
    ctx.lineTo(xPosition, xAxisY + 5);
    ctx.stroke();

    ctx.fillText(label, xPosition - 10, xAxisY + 20);
    ctx.closePath();
  });

  let allYValues = [];
  if (typeof evaluatedData[xLabels[0]] === "number") {
    allYValues = Object.values(evaluatedData);
  } else {
    allYValues = Object.values(evaluatedData).flatMap((dataPoint) =>
      Object.values(dataPoint)
    );
  }

  const uniqueYValues = Array.from(new Set(allYValues)).sort((a, b) => a - b);
  const yMin = Math.min(...uniqueYValues);
  const yMax = Math.max(...uniqueYValues);

  const yTickSpacing = (graphHeight - 50) / 5;

  for (let i = 0; i <= 5; i++) {
    const yPosition = graphHeight - i * yTickSpacing - 50 + yOffset;
    ctx.beginPath();
    ctx.moveTo(yAxisX - 5, yPosition);
    ctx.lineTo(yAxisX, yPosition);
    ctx.stroke();

    const yLabel = Math.round(yMin + (yMax - yMin) * (i / 5));
    ctx.fillText(yLabel, yAxisX - 40, yPosition + 5);
    ctx.closePath();
  }
};

const drawLineGraph = (data, xVal, yVal, colorsUpdate) => {
  const graphHeight = canvas.height - 100;
  const graphWidth = canvas.width - 70;
  ////////////////////////
  // const xData = Object.keys(data).map(Number);
  /////////////////////////
  const xData = Object.keys(data);
  const xDataLabels = xData.every((key) => !isNaN(Number(key)))
    ? xData.map(Number)
    : xData;

  const yData = Object.values(data);

  drawAxes(xDataLabels, yData, data);
  const colors = colorsUpdate;
  if (typeof yData[0] === "number") {
    const yNormalized = normalizeData(yData, graphHeight);
    drawSingleLine(xDataLabels, yNormalized, colors[0], yVal);
  } else if (typeof yData[0] === "object") {
    const subCategories = Object.keys(yData[0]);
    // const colors = generateColors(subCategories.length, colorsUpdate);
    // const colors = colorsUpdate;
    subCategories.forEach((subCat, index) => {
      const ySubData = yData.map((yearData) => yearData[subCat] || 0);
      const yNormalized = normalizeData(ySubData, graphHeight);

      drawSingleLine(
        xDataLabels,
        yNormalized,
        colors[index],
        subCat,
        data,
        index
      );
    });
  }
};

const drawSingleLine = (xData, yNormalized, color, label, data, index) => {
  const graphWidth = canvas.width - 70;
  const graphHeight = canvas.height - 100;
  const xNormalized = normalizeData(xData, graphWidth);

  ctx.beginPath();
  ctx.moveTo(xNormalized[0], graphHeight - yNormalized[0] + yOffset);

  for (let i = 1; i < xData.length; i++) {
    ctx.lineTo(xNormalized[i], graphHeight - yNormalized[i] + yOffset);
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  if (label) {
    drawLegend(label, color, index);
  }
};

// Helper function to draw a legend
function drawLegend(label, color, index) {
  const legendX = canvas.width - 150;
  const legendY = index * 30;

  ctx.fillStyle = color;
  ctx.fillRect(legendX, legendY, 20, 20);
  ctx.fillStyle = "black";
  ctx.fillText(label, legendX + 25, legendY + 15);
}

function drawBarLegend(label, color, index) {
  const legendX = canvas.width - 900 + index * 150;
  const legendY = 600;

  ctx.fillStyle = color;
  ctx.fillRect(legendX, legendY, 20, 20);

  ctx.fillStyle = "black";
  ctx.fillText(label, legendX + 25, legendY + 15);
}

const drawBarAxes = (xLabels, yLabels, evaluatedData) => {
  const graphHeight = canvas.height - 120;
  const graphWidth = canvas.width - 70;
  const xAxisY = graphHeight - 40 + 45;
  const yAxisX = 50;

  // Draw x-axis
  ctx.beginPath();
  ctx.moveTo(0, xAxisY);
  ctx.lineTo(graphWidth, xAxisY);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  // Draw y-axis
  ctx.beginPath();
  ctx.moveTo(yAxisX, 0);
  ctx.lineTo(yAxisX, graphHeight);
  ctx.stroke();
  ctx.closePath();

  // Draw x-axis ticks and labels
  const xTickSpacing = (graphWidth - 50) / (xLabels.length - 1);
  xLabels.forEach((label, index) => {
    const xPosition = yAxisX + index * xTickSpacing;
    ctx.beginPath();
    ctx.moveTo(xPosition, xAxisY);
    ctx.lineTo(xPosition, xAxisY + 5);
    ctx.stroke();

    ctx.fillText(label, xPosition - 10, xAxisY + 20);
    ctx.closePath();
  });

  let allYValues = [];
  if (typeof evaluatedData[xLabels[0]] === "number") {
    allYValues = Object.values(evaluatedData);
  } else {
    allYValues = Object.values(evaluatedData).flatMap((dataPoint) =>
      Object.values(dataPoint)
    );
  }

  const uniqueYValues = Array.from(new Set(allYValues)).sort((a, b) => a - b);
  const yMin = Math.min(...uniqueYValues);
  const yMax = Math.max(...uniqueYValues);

  const yTickSpacing = (graphHeight - 50) / 5;

  for (let i = 0; i <= 5; i++) {
    const yPosition = graphHeight - i * yTickSpacing - 50;
    ctx.beginPath();
    ctx.moveTo(yAxisX - 5, yPosition);
    ctx.lineTo(yAxisX, yPosition);
    ctx.stroke();

    const yLabel = Math.round(yMin + (yMax - yMin) * (i / 5));
    ctx.fillText(yLabel, yAxisX - 40, yPosition + 5);
    ctx.closePath();
  }
};

// Draw Bar Chart
const drawBarChart = (data, x, y, colorset) => {
  const graphHeight = canvas.height - 120;
  const graphWidth = canvas.width - 70;
  ///////////////////////////////
  // const xData = Object.keys(data).map(Number);
  //////////////////////////////

  const xData = Object.keys(data);
  const xDataLabels = xData.every((key) => !isNaN(Number(key)))
    ? xData.map(Number)
    : xData;

  const yData = Object.values(data);

  const xNormalized = normalizeData(xDataLabels, graphWidth);
  const barWidth = graphWidth / (xDataLabels.length * 1.5);

  const yOffset = 20;
  const leftOffset = 20;

  const uniqueCategories = new Set();
  yData.forEach((yearData) => {
    if (typeof yearData === "object") {
      Object.keys(yearData).forEach((category) =>
        uniqueCategories.add(category)
      );
    }
  });

  const categoriesArray = Array.from(uniqueCategories);
  const colors = colorset;

  const categoryColorMap = categoriesArray.reduce((map, category, index) => {
    map[category] = colors[index];
    return map;
  }, {});

  Object.entries(categoryColorMap).forEach(([label, color]) => {
    drawBarLegend(label, color);
  });

  // Handle standard bar charts with single values
  if (typeof yData[0] === "number") {
    drawBarAxes(xDataLabels, yData, data);
    const yNormalized = normalizeData(yData, graphHeight);
    drawLegend(y, "#e74c3c", 1);

    for (let i = 0; i < xDataLabels.length; i++) {
      ctx.beginPath();
      ctx.rect(
        xNormalized[i] - leftOffset + barWidth / 4,
        graphHeight - yNormalized[i],
        barWidth - 10,
        yNormalized[i]
      );

      ctx.fillStyle = "#e74c3c";
      ctx.fill();
      ctx.closePath();
    }
  }
  // Handle stacked bar charts with nested objects (like categories per year)
  else if (typeof yData[0] === "object") {
    drawXAxes(xDataLabels, yData, data);

    yData.forEach((yearData, index) => {
      let accumulatedHeight = 0;
      const totalHeight = Object.values(yearData).reduce(
        (acc, val) => acc + val,
        0
      );

      Object.entries(yearData).forEach(([category, value]) => {
        const yNormalized = (value / totalHeight) * (graphHeight - yOffset);

        const barX = xNormalized[index] - leftOffset + barWidth / 4;
        const barY = graphHeight - accumulatedHeight - yNormalized - yOffset;

        ctx.beginPath();
        ctx.rect(barX, barY, barWidth - 10, yNormalized);

        ctx.fillStyle = categoryColorMap[category] || "#000";
        ctx.fill();
        ctx.closePath();

        const labelX = barX + (barWidth - 10) / 2 - 15;
        const labelY = barY + 25;

        ctx.fillStyle = "black";
        ctx.fillText(value, labelX, labelY);

        accumulatedHeight += yNormalized;
      });
    });

    categoriesArray.forEach((label, index) => {
      drawBarLegend(label, categoryColorMap[label], index);
    });
  }

  // NEW LOGIC: Handle deeply nested objects with multiple category layers
  else if (
    typeof yData[0] === "object" &&
    typeof Object.values(yData[0])[0] === "object"
  ) {
    console.log("Handling nested categories...");

    xDataLabels.forEach((key, index) => {
      let accumulatedHeight = 0;

      // Loop through each main group (e.g., "Consulate", "Embassy")
      Object.entries(yData[index]).forEach(([mainGroup, subCategoryValues]) => {
        const mainGroupHeight = Object.values(subCategoryValues).reduce(
          (acc, val) => acc + val,
          0
        );

        Object.entries(subCategoryValues).forEach(([subCategory, value]) => {
          const yNormalized =
            (value / mainGroupHeight) * (graphHeight - yOffset);

          const barX = xNormalized[index] - leftOffset + barWidth / 4;
          const barY = graphHeight - accumulatedHeight - yNormalized - yOffset;

          ctx.beginPath();
          ctx.rect(barX, barY, barWidth - 10, yNormalized);

          ctx.fillStyle = categoryColorMap[subCategory] || "#000";
          ctx.fill();
          ctx.closePath();

          const labelX = barX + (barWidth - 10) / 2 - 15;
          const labelY = barY + 25;

          ctx.fillStyle = "black";
          ctx.fillText(value, labelX, labelY);

          accumulatedHeight += yNormalized;
        });
      });
    });

    // Draw legends for sub-categories
    categoriesArray.forEach((label, index) => {
      drawBarLegend(label, categoryColorMap[label], index);
    });
  }
};

// Draw Pie Chart
const drawPieChart = (data, x, y, colorset) => {
  const xData = Object.keys(data).map(Number);
  const yData = Object.values(data);
  const categoriesArray = Object.keys(yData[0]);

  const colors = colorset;

  const categoryColorMap = categoriesArray.reduce((map, category, index) => {
    map[category] = colors[index];
    return map;
  }, {});

  Object.entries(categoryColorMap).forEach(([label, color]) => {
    drawLegend(label, color);
  }); ////
  const totalYears = xData.length;
  const radius = Math.min(canvas.width / totalYears, canvas.height) / 4;

  let xOffset = 0;
  const piesPerRow = Math.floor(canvas.width / (200 + 20));
  const pieDiameter = 140;
  const pieRadius = pieDiameter / 2;
  const verticalOffset = 50;

  if (typeof yData[0] === "number") {
    const total = yData.reduce((acc, val) => acc + val, 0);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 4;

    let startAngle = 0;

    yData.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = `hsl(${(index / yData.length) * 360}, 70%, 60%)`;
      ctx.fill();

      const labelX = centerX + 200 * Math.cos(startAngle + sliceAngle / 2); // Position X
      const labelY = centerY + 200 * Math.sin(startAngle + sliceAngle / 2); // Position Y

      ctx.fillStyle = "black"; // Color of the label text
      ctx.fillText(value, labelX, labelY);

      startAngle = endAngle;
    });
    drawLegend(y, "black", 1);
  } else if (typeof yData[0] === "object") {
    const legendIndexMap = {};
    yData.forEach((yearData, yearIndex) => {
      const total = Object.values(yearData).reduce((acc, val) => acc + val, 0);
      let startAngle = 0;

      const rowIndex = Math.floor(yearIndex / piesPerRow);
      const colIndex = yearIndex % piesPerRow;

      const centerX = colIndex * (pieDiameter + 20) + pieRadius;
      const centerY =
        rowIndex * (pieDiameter + 20) + pieRadius + verticalOffset;

      Object.entries(yearData).forEach(([category, value], index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, pieRadius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle =
          categoryColorMap[category] ||
          `hsl(${(index / categoriesArray.length) * 360}, 70%, 60%)`;
        ctx.fill();

        const labelX =
          centerX + (pieRadius / 2) * Math.cos(startAngle + sliceAngle / 2);
        const labelY =
          centerY + (pieRadius / 2) * Math.sin(startAngle + sliceAngle / 2);

        ctx.fillStyle = "black";
        ctx.fillText(value, labelX, labelY);

        startAngle = endAngle;

        if (!legendIndexMap[category]) {
          const legendIndex = Object.keys(legendIndexMap).length;
          legendIndexMap[category] = true;
          drawPieLegend(category, categoryColorMap[category], legendIndex);
        }
      });

      xOffset += 2 * radius + 50;

      ctx.fillStyle = "black";
      ctx.font = "bold 16px Arial";
      ctx.fillText(
        `${xData[yearIndex]}`,
        centerX - 30,
        centerY - pieRadius - 10
      );
    });

    const canvasParent = canvas.parentElement;
    canvasParent.style.width = "window.innerWidth";
    canvasParent.style.overflow = "scroll";
  }
};

function drawPieLegend(label, color, index) {
  const legendX = canvas.width - 350;
  const legendY = index * 30;

  ctx.fillStyle = color;
  ctx.fillRect(legendX, legendY, 20, 20);

  ctx.fillStyle = "black";
  ctx.fillText(label, legendX + 25, legendY + 15);
}

const drawXAxes = (xLabels, yLabels, evaluatedData) => {
  const xData = Object.keys(evaluatedData).map(Number);
  const graphWidth = canvas.width - 80;
  const xAxisY = canvas.height - 40;
  const yAxisX = 25;

  // Draw x-axis
  ctx.beginPath();
  ctx.moveTo(20, xAxisY);
  ctx.lineTo(graphWidth + 20, xAxisY);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  const xNormalized = normalizeData(xData, graphWidth); // Ensure same normalization method as bar chart
  const barWidth = graphWidth / (xData.length * 1.5);

  xLabels.forEach((label, index) => {
    const xPosition = xNormalized[index] + barWidth / 4;

    ctx.beginPath();
    ctx.moveTo(xPosition, xAxisY); // Start tick line
    ctx.lineTo(xPosition, xAxisY + 5); // Draw tick line
    ctx.stroke(); // Draw the tick
    ctx.closePath();

    const labelWidth = ctx.measureText(label).width;
    ctx.fillText(label, xPosition - labelWidth / 2, xAxisY + 20);
  });
};
