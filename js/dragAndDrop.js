import { readFile } from "./readFile.js";

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
  readFile(file[0]);
}

// function uploadFile(file) {
//   console.log("Uploading:", file.name);
//   // Add your file upload logic here
//   var workbook = XLSX.readFile(file);
// }
