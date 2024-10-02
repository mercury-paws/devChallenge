import { evaluateData } from "./evaluateData.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let graphTypeUpdate;
let dataUpdate;
const canvasHeight = 700;
const yOffset = 50;
const updateCanvasSize = () => {
  canvas.height = canvasHeight;
  canvas.width = window.innerWidth - 50;
};
updateCanvasSize();

window.addEventListener("resize", () => {
  updateCanvasSize(); // Update canvas size on resize
  drawGraph(graphTypeUpdate, dataUpdate);
});

export function drawGraph(graphType, data) {
  graphTypeUpdate = graphType;
  dataUpdate = data;

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
    drawLineGraph(evaluatedData, x, y);
  } else if (graphType === "barChart") {
    drawBarChart(evaluatedData, x, y);
  } else if (graphType === "pieChart") {
    drawPieChart(evaluatedData, x, y);
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
  const graphHeight = canvas.height - 100; // Reduce height by 50px
  const graphWidth = canvas.width - 70; // Reduce width by 20px
  const xAxisY = graphHeight - 40 + yOffset; // Y position for x-axis
  const yAxisX = 50; // X position for y-axis

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

const drawLineGraph = (data, xVal, yVal) => {
  const graphHeight = canvas.height - 100; // Adjusted graph height
  const graphWidth = canvas.width - 70; // Adjusted graph width
  const xData = Object.keys(data).map(Number);
  const yData = Object.values(data);

  drawAxes(xData, yData, data);

  if (typeof yData[0] === "number") {
    const yNormalized = normalizeData(yData, graphHeight);
    drawSingleLine(xData, yNormalized, "#3498db", yVal);
  } else if (typeof yData[0] === "object") {
    const subCategories = Object.keys(yData[0]);
    const colors = generateColors(subCategories.length);

    subCategories.forEach((subCat, index) => {
      const ySubData = yData.map((yearData) => yearData[subCat] || 0);
      const yNormalized = normalizeData(ySubData, graphHeight);

      drawSingleLine(xData, yNormalized, colors[index], subCat, data, index);
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
  const legendX = canvas.width - 150; // X position for the legend, adjust as needed
  const legendY = index * 30; // Y position for the legend, spaced by 30 pixels for each item

  ctx.fillStyle = color; // Set the color for the legend item
  ctx.fillRect(legendX, legendY, 20, 20); // Draw a colored square for the legend

  ctx.fillStyle = "black"; // Set the color for the label text
  ctx.fillText(label, legendX + 25, legendY + 15); // Draw the label next to the square
}

// Generate a list of unique colors
function generateColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(${(i * 360) / count}, 70%, 50%)`); // Distribute colors evenly
  }
  return colors;
}

function drawBarLegend(label, color, index) {
  const legendX = canvas.width - 900 + index * 100; // X position for the legend, adjusted to be spaced horizontally
  const legendY = 600; // Keep Y position constant for horizontal layout

  ctx.fillStyle = color; // Set the color for the legend item
  ctx.fillRect(legendX, legendY, 20, 20); // Draw a colored square for the legend

  ctx.fillStyle = "black"; // Set the color for the label text
  ctx.fillText(label, legendX + 25, legendY + 15); // Draw the label next to the square
}
const drawBarAxes = (xLabels, yLabels, evaluatedData) => {
  const graphHeight = canvas.height - 120; // Reduce height by 50px
  const graphWidth = canvas.width - 70; // Reduce width by 20px
  const xAxisY = graphHeight - 40 + yOffset; // Y position for x-axis
  const yAxisX = 50; // X position for y-axis

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

// Draw Bar Chart
const drawBarChart = (data, x, y) => {
  const graphHeight = canvas.height - 120; // Height remains unchanged
  const graphWidth = canvas.width - 70; // Width remains unchanged
  const xData = Object.keys(data).map(Number); // Get years as numbers
  const yData = Object.values(data); // Get corresponding values

  const xNormalized = normalizeData(xData, graphWidth); // Normalize xData based on graphWidth
  const barWidth = graphWidth / (xData.length * 1.5); // Keep the barWidth the same
  /////////////////////
  const yOffset = 20;
  const leftOffset = 20;
  ///////////////////////
  // Collect all unique categories from the data to ensure consistent colors
  const uniqueCategories = new Set();
  yData.forEach((yearData) => {
    if (typeof yearData === "object") {
      Object.keys(yearData).forEach((category) =>
        uniqueCategories.add(category)
      );
    }
  });

  const categoriesArray = Array.from(uniqueCategories); // Convert Set to Array
  const colors = generateColors(categoriesArray.length); // Generate colors for unique categories

  // Create a category-to-color mapping for consistent color assignment
  const categoryColorMap = categoriesArray.reduce((map, category, index) => {
    map[category] = colors[index];
    return map;
  }, {});

  Object.entries(categoryColorMap).forEach(([label, color]) => {
    drawBarLegend(label, color); // Call drawLegend for each label-color pair
  });

  // Check if the year data is a number (simple data) or an object (complex data)
  if (typeof yData[0] === "number") {
    drawBarAxes(xData, yData, data);
    const yNormalized = normalizeData(yData, graphHeight); // Normalize the height
    drawLegend(y, "#e74c3c", 1);
    for (let i = 0; i < xData.length; i++) {
      ctx.beginPath();
      ctx.rect(
        xNormalized[i] - leftOffset + barWidth / 4, // Adjusting for thinner spacing
        graphHeight - yNormalized[i], // Correctly adjust the height for lower position
        barWidth - 10, // Keep this as it is
        yNormalized[i]
      );

      ctx.fillStyle = "#e74c3c"; // Color of the bar
      ctx.fill();
      ctx.closePath();
    }
  } else if (typeof yData[0] === "object") {
    drawXAxes(xData, yData, data);
    // Complex case: Multiple categories

    yData.forEach((yearData, index) => {
      let accumulatedHeight = 0; // Reset for each year
      const totalHeight = Object.values(yearData).reduce(
        (acc, val) => acc + val,
        0
      ); // Calculate total height for the bar in each year

      // Draw each category segment within the bar
      Object.entries(yearData).forEach(([category, value]) => {
        const yNormalized = (value / totalHeight) * (graphHeight - yOffset); // Normalize height based on total height

        const barX = xNormalized[index] - leftOffset + barWidth / 4; // Adjusted for thinner spacing
        const barY = graphHeight - accumulatedHeight - yNormalized - yOffset; // Position of the segment

        ctx.beginPath();
        ctx.rect(
          barX, // Use calculated barX
          barY, // Use calculated barY
          barWidth - 10, // Set bar width
          yNormalized // Segment height
        );

        // Use the category-to-color mapping for consistent colors
        ctx.fillStyle = categoryColorMap[category] || "#000"; // Fallback to black if no color found
        ctx.fill();
        ctx.closePath();

        // Calculate label position
        const labelX = barX + (barWidth - 10) / 2 - 15; // Center label horizontally
        const labelY = barY + 25; // Position it slightly above the bar segment

        ctx.fillStyle = "black"; // Color of the label text
        ctx.fillText(value, labelX, labelY); //

        accumulatedHeight += yNormalized; // Update accumulated height for stacking segments
      });
    });
    categoriesArray.forEach((label, index) => {
      drawBarLegend(label, categoryColorMap[label], index); // Call drawBarLegend for each label-color pair
    });
  }
};

// Draw Pie Chart
const drawPieChart = (data, x, y) => {
  const xData = Object.keys(data).map(Number); // Extract years
  const yData = Object.values(data); // Get corresponding data for each year
  const categoriesArray = Object.keys(yData[0]);

  //////
  const colors = generateColors(categoriesArray.length); // Generate colors for unique categories

  // Create a category-to-color mapping for consistent color assignment
  const categoryColorMap = categoriesArray.reduce((map, category, index) => {
    map[category] = colors[index];
    return map;
  }, {});

  Object.entries(categoryColorMap).forEach(([label, color]) => {
    drawLegend(label, color); // Call drawLegend for each label-color pair
  }); ////
  const totalYears = xData.length;
  const radius = Math.min(canvas.width / totalYears, canvas.height) / 4; // Adjust radius based on canvas size

  let xOffset = 0;
  const piesPerRow = Math.floor(canvas.width / (200 + 20)); // 200 is pie diameter, 20 is padding
  const pieDiameter = 140; // Fixed diameter for each pie
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
    // canvas.width = 2000;
    // canvas.height = 1500;
    const legendIndexMap = {}; // Object to keep track of drawn legend items
    yData.forEach((yearData, yearIndex) => {
      const total = Object.values(yearData).reduce((acc, val) => acc + val, 0); // Calculate total for the year
      let startAngle = 0;

      const rowIndex = Math.floor(yearIndex / piesPerRow);
      const colIndex = yearIndex % piesPerRow;

      const centerX = colIndex * (pieDiameter + 20) + pieRadius; // Center X based on column
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
          centerX + (pieRadius / 2) * Math.cos(startAngle + sliceAngle / 2); // Position X
        const labelY =
          centerY + (pieRadius / 2) * Math.sin(startAngle + sliceAngle / 2); // Position Y

        ctx.fillStyle = "black"; // Color of the label text
        ctx.fillText(value, labelX, labelY);

        startAngle = endAngle;

        // Draw the legend for this category only if it hasn't been drawn yet
        if (!legendIndexMap[category]) {
          const legendIndex = Object.keys(legendIndexMap).length; // Get current count of unique categories
          legendIndexMap[category] = true; // Mark this category as drawn
          drawPieLegend(category, categoryColorMap[category], legendIndex); // Call drawPieLegend
        }
      });

      xOffset += 2 * radius + 50; // Move to the right for the next pie chart

      ctx.fillStyle = "black"; // Color of the year text
      ctx.font = "bold 16px Arial"; // Set font style
      ctx.fillText(
        `${xData[yearIndex]}`,
        centerX - 30,
        centerY - pieRadius - 10
      ); // Position the year label
    });

    const canvasParent = canvas.parentElement;
    canvasParent.style.width = "window.innerWidth";
    canvasParent.style.overflow = "scroll";
  }
};

function drawPieLegend(label, color, index) {
  const legendX = canvas.width - 350; // X position for the legend, adjust as needed
  const legendY = index * 30; // Y position for the legend, spaced by 30 pixels for each item

  // Draw the colored square for the legend item
  ctx.fillStyle = color; // Set the color for the legend item
  ctx.fillRect(legendX, legendY, 20, 20); // Draw a colored square for the legend

  // Set the color for the label text and draw the label next to the square
  ctx.fillStyle = "black"; // Set the color for the label text
  ctx.fillText(label, legendX + 25, legendY + 15); // Draw the label next to the square
}

const drawXAxes = (xLabels, yLabels, evaluatedData) => {
  const xData = Object.keys(evaluatedData).map(Number); // Get years as numbers
  const graphWidth = canvas.width - 70; // Calculate usable graph width
  const xAxisY = canvas.height - 40; // Y position for x-axis
  const yAxisX = 50; // X position for y-axis

  // Draw x-axis
  ctx.beginPath();
  ctx.moveTo(0, xAxisY); // Start at the left end of the x-axis
  ctx.lineTo(canvas.width, xAxisY); // Draw to the right end of the x-axis
  ctx.strokeStyle = "#000"; // Set the color of the axes
  ctx.lineWidth = 2; // Set the line width
  ctx.stroke(); // Actually draw the x-axis
  ctx.closePath();

  // Calculate bar width for alignment
  const barWidth = graphWidth / (xData.length * 1.5); // Adjusted bar width

  // Draw x-axis ticks and labels
  xLabels.forEach((label, index) => {
    // Center the tick under the bar
    const xPosition = yAxisX + index * (barWidth * 1.5) + barWidth / 2;

    ctx.beginPath();
    ctx.moveTo(xPosition, xAxisY); // Start tick line
    ctx.lineTo(xPosition, xAxisY + 5); // Draw tick line
    ctx.stroke(); // Draw the tick
    ctx.closePath();

    // Draw label centered under the tick
    const labelWidth = ctx.measureText(label).width; // Measure the width of the label
    ctx.fillText(label, xPosition - labelWidth / 2, xAxisY + 20); // Center the label
  });
};
