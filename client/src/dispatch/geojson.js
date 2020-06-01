import * as d3 from "d3";

export const centroid = (features) => {
  let coords = features
    .map(({ geometry: { coordinates } }) => coordinates)
    .flat(2);
  const latExtent = d3.extent(coords, ([_, lat]) => lat);
  const longExtent = d3.extent(coords, ([long, _]) => long);
  console.log("CENTROID/extents", latExtent, longExtent);
  return [d3.mean(latExtent), d3.mean(longExtent)];
};
