import { displayPreview } from "./displayPreview.js";
import { selectGraph } from "./selectGraph.js";

export const readFile = (file) => {
  const reader = new FileReader();

  reader.onload = function (event) {
    event.preventDefault();
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const sheetData = XLSX.utils.sheet_to_json(
      worksheet
      // , { header: 1 }
    );

    if (!sheetData || sheetData.length === 0) {
      alert("No data in file");
      return;
    }

    const keys = Object.keys(sheetData[0]);

    if (!keys || keys.length === 0 || keys.some((key) => !key)) {
      alert("Invalid keys in the file");
      return;
    }

    for (const row of sheetData) {
      for (const key of keys) {
        const value = row[key];
        if (value === undefined || value === null) {
          alert(`Invalid value found for key "${key}"`);
          return;
        }
      }
    }

    // Data manipulation
    // console.log(sheetData);

    // console.log(keys);

    selectGraph(keys, sheetData);
    displayPreview(sheetData);
  };

  reader.readAsArrayBuffer(file);
};
