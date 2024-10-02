import { evaluateData } from "./evaluateData.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let graphTypeUpdate;
let dataUpdate;
const canvasHeight = 700;

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

  console.log(xAxis);
  if (!xAxis || !yAxis) {
    console.log("Please select both axes before drawing.");
    return;
  }

  let x = xAxis.id.replace("lineGraphx-", "");
  let y = yAxis.id.replace("lineGraphy-", "");
  // Evaluate data based on selected axes
  const evaluatedData = evaluateData(x, y, dataUpdate);

  console.log("Evaluated Data:", evaluatedData); // Log the evaluated data

  // Draw the graph based on the evaluated data
  if (graphType === "lineGraph") {
    drawLineGraph(evaluatedData, x, y); // Pass evaluatedData directly
  } else if (graphType === "barChart") {
    drawBarChart(evaluatedData, x, y); // Pass evaluatedData directly
  } else if (graphType === "pieChart") {
    drawPieChart(evaluatedData, x, y); // Pass evaluatedData directly
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
    drawLegend(label, color, index); // Add a legend for each subcategory
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

// Draw Bar Chart
const drawBarChart = (data, x, y) => {
  const xData = Object.keys(data).map(Number); // Get years as numbers
  const yData = Object.values(data); // Get corresponding values

  const xNormalized = normalizeData(xData, canvas.width);

  const barWidth = canvas.width / xData.length; // Calculate bar width for each year
  const yOffset = 50; // Move graph up by 50 pixels for better positioning
  const leftOffset = 0; // move to left

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
    drawLegend(label, color); // Call drawLegend for each label-color pair
  });

  console.log(categoryColorMap);

  // Check if the year data is a number (simple data) or an object (complex data)
  if (typeof yData[0] === "number") {
    drawAxes(xData, yData, data);
    // Simple case: Draw a single bar
    const yNormalized = normalizeData(yData, canvas.height - yOffset); // Normalize the height
    drawLegend(y, "#e74c3c", 1);
    for (let i = 0; i < xData.length; i++) {
      ctx.beginPath();
      ctx.rect(
        xNormalized[i] - leftOffset,
        canvas.height - yNormalized[i] - yOffset, // Invert y-axis
        barWidth - 10, // Adjust bar width
        yNormalized[i]
      );

      ctx.fillStyle = "#e74c3c";
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
        const yNormalized =
          (value / totalHeight) * (canvas.height - 50 - yOffset); // Normalize height based on total height

        const barX = xNormalized[index] + 5 - leftOffset + index * 20; // X position of the segment
        const barY = canvas.height - accumulatedHeight - yNormalized - yOffset; // Y position of the segment

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
  const pieDiameter = 200; // Fixed diameter for each pie
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

      const labelX = centerX + 170 * Math.cos(startAngle + sliceAngle / 2); // Position X
      const labelY = centerY + 170 * Math.sin(startAngle + sliceAngle / 2); // Position Y

      ctx.fillStyle = "black"; // Color of the label text
      ctx.fillText(value, labelX, labelY);

      startAngle = endAngle;
    });
    drawLegend(y);
  } else if (typeof yData[0] === "object") {
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
      });

      xOffset += 2 * radius + 50; // Move to the right for the next pie chart
    });

    const canvasParent = canvas.parentElement;
    canvasParent.style.width = "800px";
    canvasParent.style.overflowX = "auto";
  }
};

const drawXAxes = (xLabels, yLabels, evaluatedData) => {
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

  // Draw y-axis

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
};
