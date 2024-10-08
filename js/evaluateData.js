export const evaluateData = (xAxisKey, yAxisKey, sheetData) => {
  const isYear = (key) => /^\d{4}$/.test(key); // Regular expression to check if it's a year
  const xData = [...new Set(sheetData.map((item) => item[xAxisKey]))]; // Unique values for xAxis
  const yData = [...new Set(sheetData.map((item) => item[yAxisKey]))]; // Unique values for yAxis

  if (isYear(xAxisKey)) {
    // If xAxis is Year
    xData.sort((a, b) => a - b);
    const result = {};

    xData.forEach((year) => {
      const filteredData = sheetData.filter((item) => item[xAxisKey] === year);
      if (typeof item[yAxisKey] === "string") {
        result[year] = filteredData.reduce((acc, item) => {
          acc[item[yAxisKey]] = (acc[item[yAxisKey]] || 0) + 1;
          return acc;
        }, {});
      } else if (typeof item[yAxisKey] === "number") {
        result[year] = filteredData.reduce(
          (sum, item) => sum + item[yAxisKey],
          0
        );
      } else {
        result[year] = 0; // Default value if no data found
      }
    });
    return result;
  } else if (typeof xAxisKey === "string") {
    // If xAxis is a string
    const result = {};

    xData.forEach((region) => {
      const filteredData = sheetData.filter(
        (item) => item[xAxisKey] === region
      );

      if (filteredData.length > 0) {
        const firstItem = filteredData[0];

        if (typeof firstItem[yAxisKey] === "string") {
          result[region] = filteredData.reduce((acc, item) => {
            acc[item[yAxisKey]] = (acc[item[yAxisKey]] || 0) + 1;
            return acc;
          }, {});
        } else if (typeof firstItem[yAxisKey] === "number") {
          if (isYear(yAxisKey)) {
            // Sort the years if yAxisKey is a year instead of summing them
            const yearValues = filteredData
              .map((item) => item[yAxisKey])
              .sort((a, b) => a - b);
            result[region] = yearValues;
          } else {
            result[region] = filteredData.reduce(
              (sum, item) => sum + item[yAxisKey],
              0
            );
          }
        }
      } else {
        result[region] = 0;
      }
    });

    return result;
  }
};
