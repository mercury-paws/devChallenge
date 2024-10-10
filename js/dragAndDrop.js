import { readFile } from "./readFile.js";
import { readCSV } from "./readCSV.js";
import { readJSON } from "./readJSON.js";
import { selectGraph } from "./selectGraph.js";

// import { readTableData } from "./readTableData.js";
const previewSection = document.querySelector(".previewSection");
const canvas = document.getElementById("canvas");

const graphSettings = document.querySelector(".graphSettings");

const ctx = canvas.getContext("2d");

const dropArea = document.querySelector(".dropAreaField");
const dropFileLabel = document.querySelector(".dropFileLabel");
const textArea = document.querySelector(".textarea");
const submitTextButton = document.querySelector(".submitTextButton");
const clearBtn = document.querySelector(".clearBtn");

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

// submitTextButton.addEventListener("click", () => {
//   const textData = textArea.value.trim();

//   if (!textData) {
//     alert("Text area is empty. Please enter some data.");
//     return;
//   }

//   readTableData(textData);
// });

function handleDrop(event) {
  const dt = event.dataTransfer;
  const file = dt.files;
  handleFile(file);

  dropFileLabel.textContent = `File ${file[0].name} is dropped`;
}
function handleFile(file) {
  if (file.length > 1) {
    alert("You can select only one file");
    return;
  }

  const fileType = file[0].type;
  if (fileType.includes("sheet") || fileType.includes("excel")) {
    readFile(file[0]); // Call the readFile function for Excel
  } else if (fileType.includes("csv")) {
    readCSV(file[0]); // Call the function to read CSV
  } else if (fileType.includes("json")) {
    readJSON(file[0]); // Call the function to read JSON
  } else {
    alert("Unsupported file type. Please upload a CSV, Excel, or JSON file.");
  }
}

clearBtn.addEventListener("click", () => {
  // textArea.value = "";
  previewSection.textContent = "";

  dropFileLabel.textContent = "Drag and drop a file here or click to upload";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dropArea.classList.remove("highlight");

  graphSettings.textContent = "";
  selectGraph("", "");
});
