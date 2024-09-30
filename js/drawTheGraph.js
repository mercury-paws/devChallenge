import { evaluateData } from "./evaluateData.js";

const drawDraph = document.querySelector(".drawDraph");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let graphTypeUpdate;
let dataUpdate;
const legendWidth = 150;
const canvasHeight = 600;

const updateCanvasSize = () => {
  canvas.height = canvasHeight;
  canvas.width = window.innerWidth - legendWidth;
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

  console.log(xAxis);
  if (!xAxis || !yAxis) {
    console.log("Please select both axes before drawing.");
    return;
  }

  const legendDiv = document.getElementById("legend");
  legendDiv.innerHTML = ""; // Clear previous legends

  let x = xAxis.id.replace("lineGraphx-", "");
  let y = yAxis.id.replace("lineGraphy-", "");
  // Evaluate data based on selected axes
  const evaluatedData = evaluateData(x, y, dataUpdate);

  console.log("Evaluated Data:", evaluatedData); // Log the evaluated data

  // Draw the graph based on the evaluated data
  if (graphType === "lineGraph") {
    drawLineGraph(evaluatedData, x, y); // Pass evaluatedData directly
  } else if (graphType === "barChart") {
    drawBarChart(evaluatedData); // Pass evaluatedData directly
  } else if (graphType === "pieChart") {
    drawPieChart(evaluatedData); // Pass evaluatedData directly
  }
}

// Function to normalize data to fit within the canvas dimensions
const normalizeData = (data, canvasSize, padding = 50) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  return data.map(
    (val) => ((val - min) / (max - min)) * (canvasSize - padding) + padding
  );
};

const drawAxes = (xLabels, yLabels, evaluatedData) => {
  const xAxisY = canvas.height - 50; // Y position for x-axis
  const yAxisX = 50; // X position for y-axis

  // Draw x-axis
  ctx.beginPath();
  ctx.moveTo(0, xAxisY); // Start at the left end of the x-axis
  ctx.lineTo(canvas.width, xAxisY); // Draw to the right end of the x-axis
  ctx.strokeStyle = "#000"; // Set the color of the axes
  ctx.lineWidth = 2; // Set the line width
  ctx.stroke(); // Actually draw the x-axis
  ctx.closePath();

  // Draw y-axis
  ctx.beginPath();
  ctx.moveTo(yAxisX, 0); // Start at the top end of the y-axis
  ctx.lineTo(yAxisX, canvas.height); // Draw to the bottom end of the y-axis
  ctx.stroke(); // Actually draw the y-axis
  ctx.closePath();

  // Draw x-axis ticks and labels
  const xTickSpacing = (canvas.width - 50) / (xLabels.length - 1); // Spacing between x ticks
  xLabels.forEach((label, index) => {
    const xPosition = yAxisX + index * xTickSpacing; // Calculate x position for each label
    ctx.beginPath();
    ctx.moveTo(xPosition, xAxisY); // Start tick line
    ctx.lineTo(xPosition, xAxisY + 5); // Draw tick line
    ctx.stroke(); // Draw the tick

    ctx.fillText(label, xPosition - 10, xAxisY + 20); // Draw label
    ctx.closePath();
  });

  // Step 1: Collect all y-values from the evaluated data
  let allYValues = [];

  // Determine if evaluatedData is simple or complex
  if (typeof evaluatedData[xLabels[0]] === "number") {
    // Simple case: e.g., { "2000": 1224, "2001": 1354, ... }
    allYValues = Object.values(evaluatedData);
  } else {
    // Complex case: e.g., { "2000": { "Consulate": 6, ... }, ... }
    allYValues = Object.values(evaluatedData).flatMap((dataPoint) =>
      Object.values(dataPoint)
    );
  }

  // Step 2: Get unique y-values
  const uniqueYValues = Array.from(new Set(allYValues)).sort((a, b) => a - b);

  // Step 3: Determine min and max y-values for scaling
  const yMin = Math.min(...uniqueYValues);
  const yMax = Math.max(...uniqueYValues);

  // Step 4: Draw y-axis ticks and labels
  const yTickSpacing = (canvas.height - 50) / 5; // Create 5 ticks for the y-axis

  for (let i = 0; i <= 5; i++) {
    const yPosition = canvas.height - i * yTickSpacing - 50; // Calculate y position
    ctx.beginPath();
    ctx.moveTo(yAxisX - 5, yPosition); // Start tick line
    ctx.lineTo(yAxisX, yPosition); // Draw tick line
    ctx.stroke(); // Draw the tick

    const yLabel = Math.round(yMin + (yMax - yMin) * (i / 5)); // Calculate corresponding label
    ctx.fillText(yLabel, yAxisX - 40, yPosition + 5); // Draw y value label
    ctx.closePath();
  }
};

// Draw Line Graph
const drawLineGraph = (data, xVal, yVal) => {
  const xData = Object.keys(data).map(Number); // Extract years as numbers
  const yData = Object.values(data); // Get corresponding values
  drawAxes(xData, yData, data);
  // Check if data is a simple series (single number per year) or complex series (multiple subcategories)
  if (typeof yData[0] === "number") {
    // Simple case: Single line graph
    const yNormalized = normalizeData(yData, canvas.height);
    drawSingleLine(xData, yNormalized, "#3498db", yVal);
  } else if (typeof yData[0] === "object") {
    // Complex case: Multiple subcategories
    const subCategories = Object.keys(yData[0]); // Get the keys like "Consul", "Deputy Minister", etc.

    const colors = generateColors(subCategories.length); // Generate different colors for each subcategory

    // Draw a separate line for each subcategory
    subCategories.forEach((subCat, index) => {
      const ySubData = yData.map((yearData) => yearData[subCat] || 0); // Get subcategory data for each year
      const yNormalized = normalizeData(ySubData, canvas.height);

      drawSingleLine(xData, yNormalized, colors[index], subCat, data, index);
    });
  }
};

// Helper function to draw a single line given x and y data
const drawSingleLine = (xData, yNormalized, color, label, data, index) => {
  const xNormalized = normalizeData(xData, canvas.width);

  ctx.beginPath();
  ctx.moveTo(xNormalized[0], canvas.height - yNormalized[0]); // Invert y-axis for canvas

  for (let i = 1; i < xData.length; i++) {
    ctx.lineTo(xNormalized[i], canvas.height - yNormalized[i]); // Invert y-axis for canvas
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  if (label) {
    drawLegend(label, color, data, index); // Add a legend for each subcategory
  }
};

// Helper function to draw a legend
const drawLegend = (label, color, data, index) => {
  const legendDiv = document.getElementById("legend");
  const legendItem = document.createElement("div");

  legendItem.style.color = color;
  legendItem.textContent = label;

  legendDiv.appendChild(legendItem);
};

// Generate a list of unique colors
function generateColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(${(i * 360) / count}, 70%, 50%)`); // Distribute colors evenly
  }
  return colors;
}

// Draw Bar Chart
const drawBarChart = (data) => {
  const xData = Object.keys(data).map(Number); // Get years as numbers
  const yData = Object.values(data); // Get corresponding values
  const xNormalized = normalizeData(xData, canvas.width);

  const barWidth = canvas.width / xData.length; // Calculate bar width for each year

  // Generate category colors based on the categories in the first year of data
  const categoriesArray = Object.keys(yData[0] || {}); // Assuming all years have the same categories
  const colors = generateColors(categoriesArray.length);

  // Check if the year data is a number (simple data) or an object (complex data)
  if (typeof yData[0] === "number") {
    // Simple case: Draw a single bar
    const yNormalized = normalizeData(yData, canvas.height); // Normalize the height

    for (let i = 0; i < xData.length; i++) {
      ctx.beginPath();
      ctx.rect(
        xNormalized[i],
        canvas.height - yNormalized[i], // Invert y-axis
        barWidth - 10, // Adjust bar width
        yNormalized[i]
      );

      ctx.fillStyle = "#e74c3c";
      ctx.fill();
      ctx.closePath();
    }
  } else if (typeof yData[0] === "object") {
    // Complex case: Multiple categories
    yData.forEach((yearData, index) => {
      let accumulatedHeight = 0; // Reset for each year
      const totalHeight = Object.values(yearData).reduce(
        (acc, val) => acc + val,
        0
      ); // Calculate total height for the bar in each year

      // Draw each category segment within the bar
      Object.entries(yearData).forEach(([category, value]) => {
        const yNormalized = (value / totalHeight) * (canvas.height - 50); // Normalize height based on total height
        const categoryIndex = categoriesArray.indexOf(category); // Find index of category for color assignment

        ctx.beginPath();
        ctx.rect(
          xNormalized[index] + 5, // Add some padding
          canvas.height - accumulatedHeight - yNormalized, // Invert y-axis for correct position
          barWidth - 10, // Set bar width
          yNormalized // Segment height
        );

        ctx.fillStyle = colors[categoryIndex]; // Use generated colors based on index
        ctx.fill();
        ctx.closePath();

        accumulatedHeight += yNormalized; // Update accumulated height for stacking segments
      });
    });
  }
};

// Draw Pie Chart
const drawPieChart = (data) => {
  const yData = Object.values(data); // Get the values for the pie chart
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

    startAngle = endAngle;
  });
};
