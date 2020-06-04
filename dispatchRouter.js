const rp = require("request-promise");
const fs = require("fs");
const util = require("util");
const router = require("express").Router();

import { GroupByOptions, groupBy } from "./server/groupby";
import {
  allTweets,
  groupByInterval,
  tweetsByType,
  tweetsByArea,
  tweetsForArea,
} from "./dispatchHelpers";

const allTweetsController = async (req, res, next) => {
  try {
    const all = await allTweets(req.params.mostRecent);
    const result = groupBy(GroupByOptions.Nothing, all).map(groupByInterval);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
router.get("/tweets/:mostRecent?", allTweetsController);
router.get("/tweets/seattle/:mostRecent?", allTweetsController);

router.get("/tweets/byType/:mostRecent?", async (req, res, next) => {
  try {
    const byType = await tweetsByType(req.params.mostRecent);
    const result = byType.map(groupByInterval);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

router.get("/tweets/byAreaByType/:mostRecent?", async (req, res, next) => {
  try {
    const byArea = await tweetsByArea(req.params.mostRecent);
    const result = byArea.map(({ values, ...rest }) => ({
      ...rest,
      groups: groupBy(GroupByOptions.IncidentType, values).map(groupByInterval),
    }));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

router.get("/tweets/:area/:mostRecent?", async (req, res, next) => {
  try {
    const all = await tweetsForArea(req.params.area, req.params.mostRecent);
    const result = groupBy(GroupByOptions.Nothing, all).map(groupByInterval);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

router.get("/seattle-gov", async (req, res, next) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

router.get("/static", async (req, res, next) => {
  try {
    const readFile = util.promisify(fs.readFile);
    const file = await readFile("./datasets/seattle911.json");
    const json = JSON.parse(file);
    const LIMIT = 2;
    res.json(json.slice(0, LIMIT));
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

export default router;
