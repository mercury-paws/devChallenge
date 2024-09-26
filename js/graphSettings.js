const graphSettings = document.querySelector(".graphSettings");

export const appendLineGraphSettings = (keys) => {
  event.preventDefault();
  ["x", "y"].forEach((line) => {
    graphSettings.insertAdjacentHTML(
      "beforeend",
      `<p>Select a value for ${line} axis:</p>`
    );

    keys.forEach((key) => {
      graphSettings.insertAdjacentHTML(
        "beforeend",
        `<label for="lineGraph${line}-${key}">${key}</label>
    <input type="radio" id="lineGraph${line}-${key}" name="${line}Axis" required />`
      );
    });
  });
};
