import { evaluateData } from "./evaluateData.js";

const drawDraph = document.querySelector(".drawDraph");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

export const drawGraph = (graphType, data) => {
  console.log("Inside drawGraph, received data:", data);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const xAxis = document.querySelector("input[name=xAxis]:checked");
  const yAxis = document.querySelector("input[name=yAxis]:checked");

  console.log(xAxis);
  if (!xAxis || !yAxis) {
    console.log("Please select both axes before drawing.");
    return;
  }

  // Evaluate data based on selected axes
  const evaluatedData = evaluateData(
    xAxis.id.replace("lineGraphx-", ""),
    yAxis.id.replace("lineGraphy-", ""),
    data
  );

  console.log("Evaluated Data:", evaluatedData); // Log the evaluated data

  // Draw the graph based on the evaluated data
  if (graphType === "lineGraph") {
    drawLineGraph(evaluatedData); // Pass evaluatedData directly
  } else if (graphType === "barChart") {
    drawBarChart(evaluatedData); // Pass evaluatedData directly
  } else if (graphType === "pieChart") {
    drawPieChart(evaluatedData); // Pass evaluatedData directly
  }
};

// Function to normalize data to fit within the canvas dimensions
const normalizeData = (data, canvasSize, padding = 50) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  return data.map(
    (val) => ((val - min) / (max - min)) * (canvasSize - padding) + padding
  );
};

// Draw Line Graph
const drawLineGraph = (data) => {
  const xData = Object.keys(data).map(Number); // Get years as numbers
  const yData = Object.values(data); // Get corresponding values

  const xNormalized = normalizeData(xData, canvas.width);
  const yNormalized = normalizeData(yData, canvas.height);

  ctx.beginPath();
  ctx.moveTo(xNormalized[0], yNormalized[0]);

  for (let i = 1; i < xData.length; i++) {
    ctx.lineTo(xNormalized[i], canvas.height - yNormalized[i]); // Invert y-axis for canvas
  }

  ctx.strokeStyle = "#3498db";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
};

// Draw Bar Chart
const drawBarChart = (data) => {
  const xData = Object.keys(data).map(Number); // Get years as numbers
  const yData = Object.values(data); // Get corresponding values

  const xNormalized = normalizeData(xData, canvas.width);
  const yNormalized = normalizeData(yData, canvas.height);

  const barWidth = canvas.width / xData.length;

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
