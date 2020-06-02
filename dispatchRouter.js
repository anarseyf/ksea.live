const rp = require("request-promise");
const fs = require("fs");
const util = require("util");
const router = require("express").Router();

router.get("static", async (req, res, next) => {
  const readFile = util.promisify(fs.readFile);
  const file = await readFile("./datasets/seattle911.json");
  const LIMIT = 50;
  res.json(JSON.parse(file).slice(0, LIMIT));
});

router.get("tweets", async (req, res, next) => {
  console.log("API:tweets");
  const readFile = util.promisify(fs.readFile);
  const file = await readFile("./datasets/tweets.json");
  const tweets = JSON.parse(file);
  res.json(tweets);
});

router.get("seattle-gov", async (req, res, next) => {
  const options = {
    uri: "https://data.seattle.gov/resource/fire-911.json",
    json: true,
    qs: {
      $limit: 10,
      $where: "date_extract_y(datetime) >= 2020",
      $$router_token: "DvY4gobAudCWKcwYz3yqTd25h", // https://data.seattle.gov/profile/edit/developer_settings
    },
  };

  const start = +new Date();
  rp(options).then((json) => {
    const end = +new Date();
    const latency = (end - start) / 1000;
    res.json(json);
  });
});

module.exports = router;
