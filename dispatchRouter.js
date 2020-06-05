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
  dataPath,
} from "./dispatchHelpers";
import { readJSONAsync } from "./scripts/dispatch/fileUtils";

const mostRecentController = async (req, res, next) => {
  let result;
  try {
    const readdirAsync = util.promisify(fs.readdir);
    const dir = await readdirAsync(dataPath, { withFileTypes: true });
    const fileNames = dir
      .map(({ name }) => name)
      .sort()
      .reverse();

    let result = null;
    if (fileNames.length) {
      const mostRecentFile = fileNames[0];
      const tweets = await readJSONAsync(`${dataPath}${mostRecentFile}`, []);
      if (tweets.length) {
        result = tweets[0].id_str;
      }
    }

    if (!result) {
      throw "mostRecentId not found";
    }
    res.send(result);
  } catch (e) {
    console.error("error getting mostRecentId", e);
    res.status(500).send(null);
  }
};
router.get("/mostRecentId", mostRecentController);

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
router.get("/tweets", allTweetsController);
router.get("/tweets/after/:mostRecent?", allTweetsController);
router.get("/tweets/seattle", allTweetsController);
router.get("/tweets/seattle/after/:mostRecent?", allTweetsController);

const byTypeController = async (req, res, next) => {
  try {
    const byType = await tweetsByType(req.params.mostRecent);
    const result = byType.map(groupByInterval);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
router.get("/tweets/byType", byTypeController);
router.get("/tweets/byType/after/:mostRecent?", byTypeController);

const byAreabyTypeController = async (req, res, next) => {
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
};
router.get("/tweets/byAreaByType", byAreabyTypeController);
router.get("/tweets/byAreaByType/after/:mostRecent?", byAreabyTypeController);

const forAreaController = async (req, res, next) => {
  try {
    const all = await tweetsForArea(req.params.area, req.params.mostRecent);
    const result = groupBy(GroupByOptions.Nothing, all).map(groupByInterval);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
router.get("/tweets/:area", forAreaController);
router.get("/tweets/:area/after/:mostRecent?", forAreaController);

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
