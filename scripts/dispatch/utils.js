const axios = require("axios").default;
// const bignum = require("bignum");

export const getUserTimeline = async (config) => {
  const res = await axios
    .get("https://api.twitter.com/1.1/statuses/user_timeline.json", config)
    .catch((e) => {
      console.error("user_timeline call failed:", e.response.status, e.stack);
      throw e.message;
    });
  return res.data;
};

export const incrementIdStr = (id_str) =>
  // bignum(status.since_id).add(1).toString();
  String(+id_str + 1000);

export const decrementIdStr = (id_str) =>
  // bignum(status.since_id).sub(1).toString();
  String(+id_str - 1000);

// console.log(
//   `1268951477848023049 + 1 =\n${incrementIdStr("1268951477848023049")}`
// );
// console.log(
//   `1268951477848023049 - 1 =\n${decrementIdStr("1268951477848023049")}`
// );
