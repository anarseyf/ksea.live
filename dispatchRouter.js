const rp = require("request-promise");
const fs = require("fs");
const util = require("util");
const router = require("express").Router();

import { GroupByOptions, groupBy } from "./server/groupby";

router.get("/static", async (req, res, next) => {
  const readFile = util.promisify(fs.readFile);
  const file = await readFile("./datasets/seattle911.json");
  const LIMIT = 50;
  res.json(JSON.parse(file).slice(0, LIMIT));
});

const allTweets = async () => {
  const readFile = util.promisify(fs.readFile);
  const file = await readFile("./datasets/tweets.json");
  return JSON.parse(file);
};

const tweetsForArea = async (area) => {
  const all = await allTweets();
  const grouped = groupBy(GroupByOptions.ZipCode, all);
  const group = grouped.find((g) => g.key === area) || {};
  return group.values || [];
};

const tweetsByType = async () => {
  const all = await allTweets();
  return groupBy(GroupByOptions.IncidentType, all);
};

const tweetsByArea = async () => {
  const all = await allTweets();
  return groupBy(GroupByOptions.ZipCode, all);
};

const tweetsForType = async (type) => {
  const all = await allTweets();
  const grouped = groupBy(GroupByOptions.IncidentType, all);
  const group = grouped.find((g) => g.key === type) || {};
  return group.values || [];
};

const allTweetsController = async (req, res, next) => {
  const result = await allTweets();
  res.json(result);
};

router.get("/tweets", allTweetsController);
router.get("/tweets/seattle", allTweetsController);

router.get("/tweets/byType", async (req, res, next) => {
  const result = await tweetsByType();
  res.json(result);
});

router.get("/tweets/byAreaByType", async (req, res, next) => {
  const byArea = await tweetsByArea();
  const result = byArea.map(({ values, ...rest }) => ({
    ...rest,
    groups: groupBy(GroupByOptions.IncidentType, values),
  }));
  console.log("> API byAreaByType:", result.length);
  res.json(result);
});

router.get("/tweets/:area", async (req, res, next) => {
  const result = await tweetsForArea(req.params.area);
  res.json(result);
});

router.get("/tweets/:type", async (req, res, next) => {
  const result = await tweetsForType(req.params.type);
  res.json(result);
});

router.get("/seattle-gov", async (req, res, next) => {
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

export default router;
