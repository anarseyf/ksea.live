import * as d3 from "d3";
import zipCodes from "./zip-codes.json";
// import nhoods from "./nhoods.json";
import nhoods from "./2016_seattle_cra.json";
import city from "./2016_seattle_city.json";

const nhoodProp = "NEIGHBO"; // TODO - import from server/groupby.js
const zipcodeProp = "GEOID10";

const byArea = (features, prop) => {
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

export const cityGeojson = city;

const lat = 47.61485,
  long = -122.32838;
export const defaultCentroid = [lat, long]; // approx. centroid of cityGeojson

export const mapBounds = [
  [lat + 0.2, long - 0.3],
  [lat - 0.2, long + 0.3],
];

export const centroid = (features) => {
  if (!features.length) {
    return defaultCentroid;
  }

  let coords = features
    .map(({ geometry: { coordinates } }) => coordinates)
    .flat(2);
  const latExtent = d3.extent(coords, ([_, lat]) => lat);
  const longExtent = d3.extent(coords, ([long, _]) => long);
  return [d3.mean(latExtent), d3.mean(longExtent)];
};
