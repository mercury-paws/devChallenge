const dropArea = document.querySelector(".dropAreaField");
const dropFileLabel = document.querySelector(".dropFileLabel");

// Prevent default
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Highlight
["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(
    eventName,
    () => dropArea.classList.add("highlight"),
    false
  );
});

["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(
    eventName,
    () => dropArea.classList.remove("highlight"),
    false
  );
});

// Handle dropped files
dropArea.addEventListener("drop", handleDrop, false);

function handleDrop(event) {
  const dt = event.dataTransfer;
  const file = dt.files;
  handleFile(file);
  console.log(file);
  dropFileLabel.textContent = `File ${file[0].name} is dropped`;
}

function handleFile(file) {
  if (file.length > 1) {
    alert("You can select only one file");
    return;
  }
  uploadFile(file[0]);
}

function uploadFile(file) {
  console.log("Uploading:", file.name);
  // Add your file upload logic here
}
