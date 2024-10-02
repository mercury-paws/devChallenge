const previewSection = document.querySelector(".previewSection");
const canvas = document.getElementById("canvas");

let updateData;
export const displayPreview = (sheetData) => {
  // canvas.classList.add("displayNone");
  previewSection.classList.add("displayPreview");
  previewSection.innerHTML = `
  <h3>File Preview:</h3>
  <table id="filePreviewTable">
    <thead></thead>
    <tbody></tbody>
  </table>
  `;

  updateData = sheetData;
  const previewTable = document.getElementById("filePreviewTable");
  const tableHead = previewTable.querySelector("thead");
  const tableBody = previewTable.querySelector("tbody");

  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  const headerRow = document.createElement("tr");

  Object.keys(updateData[0]).forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  });
  tableHead.appendChild(headerRow);

  // Display the first 5 rows of data for preview (or more if needed)
  updateData.slice(0, 10).forEach((row) => {
    const tableRow = document.createElement("tr");
    Object.values(row).forEach((cellValue) => {
      const cell = document.createElement("td");
      cell.textContent = cellValue;
      tableRow.appendChild(cell);
    });
    tableBody.appendChild(tableRow);
  });
};

////////////////////////////////////////////////// draw graph / preview btn ////////////////////////////////////////////////

const drawDraphBtn = document.querySelector(".drawDraphBtn");
drawDraphBtn.addEventListener("click", () => {
  // canvas.classList.add("");
  canvas.classList.toggle("displayNone");
  previewSection.classList.toggle("displayNone");
});

////////////////////////////////////////////////// draw graph / preview btn ////////////////////////////////////////////////

const updatePreviewSize = () => {
  previewSection.style.height = "700px";
  previewSection.style.width = `${window.innerWidth}px`;
};
updatePreviewSize();

window.addEventListener("resize", () => {
  updatePreviewSize(); // Update canvas size on resize
  // displayPreview(updateData);
});
