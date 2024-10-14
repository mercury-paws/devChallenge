let colorset;
let initialCount;
import { drawGraph } from "./drawTheGraph.js";

export function setPalette(paletteName) {
  if (paletteName === "scheme1") {
    return {
      colors: [
        "#e74c3c",
        "#3498db",
        "#2ecc71",
        "#f1c40f",
        "#9b59b6",
        "#34495e",
        "#e67e22",
        "#1abc9c",
        "#16a085",
        "#2980b9",
      ],
      index: 1,
    };
  } else if (paletteName === "scheme2") {
    return {
      colors: [
        "#ff5733",
        "#33ff57",
        "#3357ff",
        "#ff33a1",
        "#33ffcc",
        "#ffcc33",
        "#5733ff",
        "#a133ff",
        "#ff3333",
        "#57ff33",
      ],
      index: 2,
    };
  } else if (paletteName === "scheme3") {
    return {
      colors: [
        "#d35400",
        "#c0392b",
        "#8e44ad",
        "#2980b9",
        "#16a085",
        "#f39c12",
        "#1abc9c",
        "#3498db",
        "#9b59b6",
        "#e74c3c",
      ],
      index: 3,
    };
  } else {
    return { colors: [""], index: 0 };
  }
}

colorset = setPalette("");

export function generateColors(count, colorset) {
  const colors = [];
  initialCount = count;

  if (colorset === undefined || colorset === null || colorset.index === 0) {
    for (let i = 0; i < initialCount; i++) {
      colors.push(`hsl(${(i * 360) / initialCount}, 70%, 50%)`);
    }
    console.log("No palette defined");
  } else if (colorset.index === 1) {
    for (let i = 0; i < Math.min(count, colorset.colors.length); i++) {
      colors.push(colorset.colors[i]);
    }

    console.log("Palette 1 is defined");
  } else if (colorset.index === 2) {
    for (let i = 0; i < Math.min(count, colorset.colors.length); i++) {
      colors.push(colorset.colors[i]);
    }
    console.log(2);
  } else if (colorset.index === 3) {
    for (let i = 0; i < Math.min(count, colorset.colors.length); i++) {
      colors.push(colorset.colors[i]);
    }
    console.log(3);
  }
  console.log(colors);
  return colors;
}
