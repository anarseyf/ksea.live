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

export const datasetsPath = path.join(__dirname, "../../datasets/official/");
export const scriptsJsonPath = path.join(__dirname, "./official/json/");

export const withDatasetsPath = (fileName) => path.join(datasetsPath, fileName);

export const withScriptsJsonPath = (fileName) => path.join(scriptsJsonPath, fileName);

export const sortByTimestampDescending = (a, b) => b.derived.timestamp - a.derived.timestamp;
