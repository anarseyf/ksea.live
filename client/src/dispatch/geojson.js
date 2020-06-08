import * as d3 from "d3";
import zipCodes from "./zip-codes.json";
// import nhoods from "./nhoods.json";
import nhoods from "./2016_seattle_cra.json";

const nhoodProp = "NEIGHBO"; // TODO - import from server/groupby.js
const zipcodeProp = "GEOID10";

const byArea = (features, prop) => {
  console.log("GEOJSON/", prop, features);
  const map = {};
  features.forEach((feature) => {
    const key = feature.properties[prop];
    const list = map[key] || [];
    list.push(feature);
    map[key] = list;
  });
  return map;
};

const zipcodeFeaturesByArea = byArea(zipCodes.features, zipcodeProp);
const nhoodFeaturesByArea = byArea(nhoods.features, nhoodProp);

const featuresForZip = (zip) => zipcodeFeaturesByArea[zip];
const featuresForNhood = (nhood) => nhoodFeaturesByArea[nhood];

export const featuresForArea = featuresForNhood;

export const areas = {
  geojson: nhoods,
  areaProp: nhoodProp,
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
