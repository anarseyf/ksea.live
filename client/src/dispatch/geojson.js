import * as d3 from "d3";
import zipCodesJson from "./zip-codes.json";

export const zipcodes = zipCodesJson;

const byArea = () => {
  const map = {};
  zipcodes.features.forEach((feature) => {
    map[feature.properties.GEOID10] = feature;
  });
  return map;
};

const featuresByArea = byArea();
console.log("geojson/by area", featuresByArea);
export const featureForArea = (area) => featuresByArea[area];

export const pathForArea = (area, { width = 100, height = 100 } = {}) => {
  // const coordinates = coordinatesByArea[area];
  // const latExtent = d3.extent(coordinates, ([_,lat])=>lat);
  // const longExtent = d3.extent(coordinates,([long])=>long);
  // const xScale = d3.scaleLinear().domain(latExtent).range([height, 0]);
  // const yScale = d3.scaleLinear().domain(longExtent).range([height, 0]);
  return null;
};

const defaultCentroid = [47.60912, -122.34494];

export const centroid = (features) => {
  if (!features.length) {
    console.warn(
      `Cannot compute centroid, returning default: ${defaultCentroid}`
    );
    return defaultCentroid;
  }
  let coords = features
    .map(({ geometry: { coordinates } }) => coordinates)
    .flat(2);
  const latExtent = d3.extent(coords, ([_, lat]) => lat);
  const longExtent = d3.extent(coords, ([long, _]) => long);
  return [d3.mean(latExtent), d3.mean(longExtent)];
};
