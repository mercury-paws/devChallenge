import { readFile } from "./readFile.js";
import { readCSV } from "./readCSV.js";
import { readJSON } from "./readJSON.js";

const dropArea = document.querySelector(".dropAreaField");
const dropFileLabel = document.querySelector(".dropFileLabel");

// Prevent default
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefault);
});

function preventDefault(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Highlight
["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, () =>
    dropArea.classList.add("highlight")
  );
});

["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, () =>
    dropArea.classList.remove("highlight")
  );
});

// Handle dropped files
dropArea.addEventListener("drop", handleDrop);

function handleDrop(event) {
  const dt = event.dataTransfer;
  const file = dt.files;
  handleFile(file);
  console.log(dt);
  dropFileLabel.textContent = `File ${file[0].name} is dropped`;
}
function handleFile(file) {
  if (file.length > 1) {
    alert("You can select only one file");
    return;
  }

  const fileType = file[0].type;
  if (fileType.includes("sheet") || fileType.includes("excel")) {
    readFile(file[0]); // Call the existing readFile function for Excel
  } else if (fileType.includes("csv")) {
    readCSV(file[0]); // Call the new function to read CSV
  } else if (fileType.includes("json")) {
    readJSON(file[0]); // Call the new function to read JSON
  } else {
    alert("Unsupported file type. Please upload a CSV, Excel, or JSON file.");
  }
}
