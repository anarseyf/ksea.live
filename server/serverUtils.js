const axios = require("axios").default;
const path = require("path");

export const getUserTimeline = async (config) => {
  const res = await axios
    .get("https://api.twitter.com/1.1/statuses/user_timeline.json", config)
    .catch((e) => {
      console.error("user_timeline call failed:", e.response.status, e.stack);
      throw e.message;
    });
  return res.data;
};

export const datasetsPath = path.join(__dirname, "../datasets/official/");
export const cachePath = path.join(__dirname, "../datasets/cache/");
export const tilesPath = path.join(__dirname, "../datasets/tiles/");
export const geojsonPath = path.join(__dirname, "../datasets/geojson/");
export const scriptsJsonPath = path.join(
  __dirname,
  "../scripts/dispatch/official/json/"
);

export const withDatasetsPath = (fileName) => path.join(datasetsPath, fileName);
export const withCachePath = (fileName) => path.join(cachePath, fileName);
export const withTilesPath = (fileName) => path.join(tilesPath, fileName);
export const withGeojsonPath = (fileName) => path.join(geojsonPath, fileName);
export const withScriptsJsonPath = (fileName) =>
  path.join(scriptsJsonPath, fileName);

export const sortByTimestampDescending = (a, b) =>
  b.derived.timestamp - a.derived.timestamp;

export const sortNewFirst = (a, b) => {
  const oldA = a.derived._old,
    oldB = b.derived._old;
  const timeA = a.derived.timestamp,
    timeB = b.derived.timestamp;
  if (oldA === oldB) {
    return timeB - timeA;
  }
  return oldA ? 1 : -1;
};

// see also clientUtils.js
export const isExactlySev1 = ({ derived: { severity } }) => severity === 1;
export const isExactlySev2 = ({ derived: { severity } }) => severity === 2;
