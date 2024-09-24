const body = document.querySelector("body");
const modeButton = document.querySelector(".modeButton");

modeButton.addEventListener("click", () => {
  if (
    body.getAttribute("class") === "darkBody" &&
    modeButton.textContent === "Switch to light mode"
  ) {
    body.setAttribute("class", "lightBody");
    modeButton.textContent = "Switch to dark mode";
  } else {
    body.setAttribute("class", "darkBody");
    modeButton.textContent = "Switch to light mode";
  }
});
