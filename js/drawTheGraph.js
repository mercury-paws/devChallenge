const drawDraph = document.querySelector(".drawDraph");

export const drawGraph = (graphType) => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const xAxis = document.querySelector("input[name=xAxis]:checked");
  const yAxis = document.querySelector("input[name=yAxis]:checked");

  console.log(xAxis);
  if (!xAxis || !yAxis) {
    console.log("Please select both axes before drawing.");
    return;
  }

  if (graphType === "lineGraph") {
    drawLineGraph(xAxis.id, yAxis.id);
  } else if (graphType === "barChart") {
    drawBarChart(xAxis.id, yAxis.id);
  } else if (graphType === "pieChart") {
    drawPieChart(xAxis.id, yAxis.id);
  }
};

const drawLineGraph = (xAxisKey, yAxisKey) => {
  // Use actual data based on selected keys (replace random data with actual data)
  ctx.beginPath();

  // let data = sheetData.forEach((row) => {
  //   Object.values(row).forEach((value) => {
  //     return value
  //   })
  //   });

  ctx.moveTo(10, 150); // Starting point
  // Simulate drawing based on selected axis keys
  const dataPoints = [100, 80, 120, 140, 90]; // Example data, replace with actual
  dataPoints.forEach((value, index) => {
    const x = 10 + index * 30; // X position
    const y = 150 - (value / 150) * 100; // Scale to fit canvas height
    ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "blue";
  ctx.stroke();
};

drawDraph.addEventListener("click", () => {
  drawGraph;
});
