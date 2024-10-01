const downloadAsPDF = document.querySelector(".downloadAsPDF");
const downloadAsSVG = document.querySelector(".downloadAsSVG");
const downloadAsPNG = document.querySelector(".downloadAsPNG");

downloadAsPDF.addEventListener("click", () => {
  downloadCanvasAsPDF();
});

downloadAsSVG.addEventListener("click", () => {
  console.log("downloadAsSVG");
});

downloadAsPNG.addEventListener("click", () => {
  downloadCanvasAsPNG();
});

function downloadCanvasAsPNG() {
  const canvas = document.getElementById("canvas");
  const link = document.createElement("a");
  link.download = "graph.png"; // Specify the file name
  link.href = canvas.toDataURL("image/png"); // Get the PNG data URL
  link.click(); // Trigger the download
}

function downloadCanvasAsPDF() {
  const canvas = document.getElementById("canvas");
  const imgData = canvas.toDataURL("image/png"); // Get the PNG data URL

  // Create a new window
  const pdfWindow = window.open("", "_blank");
  pdfWindow.document.write(`
      <html>
        <head>
          <title>Print PDF</title>
          <style>
            body { margin: 0; }
            img { display: block; margin: auto; }
          </style>
        </head>
        <body>
          <img src="${imgData}" />
        </body>
      </html>
    `);
  pdfWindow.document.close(); // Close the document for rendering
  pdfWindow.focus(); // Focus the new window
  pdfWindow.print(); // Open the print dialog
  pdfWindow.close(); // Close the window after printing
}
