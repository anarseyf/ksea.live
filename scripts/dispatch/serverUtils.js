const axios = require("axios").default;

export const getUserTimeline = async (config) => {
  const res = await axios
    .get("https://api.twitter.com/1.1/statuses/user_timeline.json", config)
    .catch((e) => {
      console.error("user_timeline call failed:", e.response.status, e.stack);
      throw e.message;
    });
  return res.data;
};

export const pathToScriptsJson = (fileName) => `./json/${fileName}`;
export const pathToDatasetsTweets = (fileName) =>
  `../../../datasets/tweets/${fileName}`;
export const pathToDatasetsOfficial = (fileName) =>
  `../../../datasets/official/${fileName}`;

export const incrementIdStr = (id_str) => (BigInt(id_str) + 1n).toString();
export const decrementIdStr = (id_str) => (BigInt(id_str) - 1n).toString();

// const test = "1268951477848023049";
// console.log(`${test} + 1 =\n${incrementIdStr(test)}`);
// console.log(`${test} - 1 =\n${decrementIdStr(test)}`);
