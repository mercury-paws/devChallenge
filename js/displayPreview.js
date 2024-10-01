const previewSection = document.querySelector(".previewSection");
const canvas = document.getElementById("canvas");

export const displayPreview = (sheetData) => {
  canvas.classList.add("displayNone");
  previewSection.classList.add("displayPreview");
  previewSection.innerHTML = `
  <h3>File Preview:</h3>
  <table id="filePreviewTable">
    <thead></thead>
    <tbody></tbody>
  </table>
  `;

  const previewTable = document.getElementById("filePreviewTable");
  const tableHead = previewTable.querySelector("thead");
  const tableBody = previewTable.querySelector("tbody");

  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  const headerRow = document.createElement("tr");

  Object.keys(sheetData[0]).forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  });
  tableHead.appendChild(headerRow);

  // Display the first 5 rows of data for preview (or more if needed)
  sheetData.slice(0, 5).forEach((row) => {
    const tableRow = document.createElement("tr");
    Object.values(row).forEach((cellValue) => {
      const cell = document.createElement("td");
      cell.textContent = cellValue;
      tableRow.appendChild(cell);
    });
    tableBody.appendChild(tableRow);
  });
};

const drawDraphBtn = document.querySelector(".drawDraphBtn");

drawDraphBtn.addEventListener("click", () => {
  // canvas.classList.add("");
  canvas.classList.remove("displayNone");
  previewSection.classList.add("displayNone");
});
