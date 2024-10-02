const downloadAsPDF = document.querySelector(".downloadAsPDF");
const downloadAsSVG = document.querySelector(".downloadAsSVG");
const downloadAsPNG = document.querySelector(".downloadAsPNG");
const printBTN = document.querySelector(".printBTN");

const canvas = document.getElementById("canvas");

downloadAsPDF.addEventListener("click", () => {
  downloadCanvasAsPDF();
});

downloadAsSVG.addEventListener("click", () => {
  downloadCanvasAsSVG();
  console.log("i have no idea how to generate svg");
});

downloadAsPNG.addEventListener("click", () => {
  downloadCanvasAsPNG();
});

printBTN.addEventListener("click", () => {
  printCanvas();
});

function downloadCanvasAsPNG() {
  const link = document.createElement("a");
  link.download = "graph.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function downloadCanvasAsPDF() {
  const imgData = canvas.toDataURL("image/png");

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
  pdfWindow.document.close();
  pdfWindow.focus();
  pdfWindow.print();
  pdfWindow.close();
}

function downloadCanvasAsSVG() {
  const width = canvas.width;
  const height = canvas.height;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        <canvas xmlns="http://www.w3.org/1999/xhtml" width="${width}" height="${height}" style="border:1px solid black;">
          <img src="${canvas.toDataURL(
            "image/png"
          )}" style="width:100%;height:100%;"/>
        </canvas>
      </foreignObject>
    </svg>
  `;

  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "graph.svg";
  link.click();

  URL.revokeObjectURL(url);
}

function printCanvas() {
  const imgData = canvas.toDataURL("image/png");

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Canvas</title>
        <style>
          body, html { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; height: 100%; }
          img { max-width: 100%; max-height: 100%; }
        </style>
      </head>
      <body>
        <img src="${imgData}" />
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();

  printWindow.print();

  printWindow.close();
}
