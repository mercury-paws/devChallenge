import { displayPreview } from "./displayPreview.js";
import { selectGraph } from "./selectGraph.js";

export const readFile = (file) => {
  const reader = new FileReader();

  reader.onload = function (event) {
    event.preventDefault();
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Get the first sheet name and its contents
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert the sheet to JSON
    const sheetData = XLSX.utils.sheet_to_json(
      worksheet
      // , { header: 1 }
    );

    // Data manipulation
    console.log(sheetData);
    const keys = Object.keys(sheetData[0]);
    console.log(keys);

    // displayPreview(sheetData);
    selectGraph(keys, sheetData);
    displayPreview(sheetData);
  };

  reader.readAsArrayBuffer(file);

  //
};
