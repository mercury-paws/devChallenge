const main = document.querySelector("main");
const modeButton = document.querySelector(".modeButton");

modeButton.addEventListener("click", () => {
  if (
    main.getAttribute("class") === "lightBody" &&
    modeButton.textContent === "Switch to dark mode"
  ) {
    main.setAttribute("class", "darkBody");
    modeButton.textContent = "Switch to light mode";
  } else {
    main.setAttribute("class", "lightBody");
    modeButton.textContent = "Switch to dark mode";
  }
});
