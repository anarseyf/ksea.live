const rp = require("request-promise");
const router = require("express").Router();

import {
  GroupByOptions,
  groupBy,
  generateHistoryIntervals,
  generateIntervals,
} from "./server/groupby";
import {
  allTweets,
  groupByIntervalGen,
  tweetsByType,
  tweetsByArea,
  tweetsForArea,
  dataPath,
  sortByTotal,
  minimizeGroup,
} from "./dispatchHelpers";
import { readJSONAsync, readdirAsync } from "./scripts/dispatch/fileUtils";

const identityFn = (v) => v;

const mostRecentController = async (req, res, next) => {
  let result;
  try {
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

const forAreaController = async (req, res, next) => {
  try {
    const intervals = generateIntervals();
    const area = req.params.area;
    const all =
      area === "seattle"
        ? await allTweets(intervals)
        : await tweetsForArea(area, intervals);
    const minimizer =
      req.query.minimize === "true" ? minimizeGroup : identityFn;

    const intervalGrouper = groupByIntervalGen(intervals);
    const result = groupBy(GroupByOptions.Nothing, all)
      .map(intervalGrouper)
      .map(minimizer)
      .sort(sortByTotal);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const byAreaController = async (req, res, next) => {
  try {
    const intervals = generateIntervals();
    const byArea = await tweetsByArea(intervals);
    const minimizer =
      req.query.minimize === "true" ? minimizeGroup : identityFn;

    const intervalGrouper = groupByIntervalGen(intervals);
    const result = byArea.map(intervalGrouper).map(minimizer).sort(sortByTotal);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const byTypeController = async (req, res, next) => {
  try {
    const intervals = generateIntervals();
    const byType = await tweetsByType(req.params.area, intervals);
    const minimizer =
      req.query.minimize === "true" ? minimizeGroup : identityFn;
    const intervalGrouper = groupByIntervalGen(intervals);
    const result = byType.map(intervalGrouper).map(minimizer).sort(sortByTotal);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const byAreabyTypeController = async (req, res, next) => {
  console.error("TODO - remove this API");
  try {
    const intervals = generateIntervals();
    const byArea = await tweetsByArea(intervals);
    const minimizer =
      req.query.minimize === "true" ? minimizeGroup : identityFn;
    const intervalGrouper = groupByIntervalGen(intervals);
    const result = byArea.map(({ values, ...rest }) => ({
      ...rest,
      groups: groupBy(GroupByOptions.IncidentType, values)
        .map(intervalGrouper)
        .map(minimizer)
        .sort(sortByTotal),
    }));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const historyController = async (req, res, next) => {
  try {
    // TODO: bin size = 24h, interval = 30 days, etc.

    const intervals = generateHistoryIntervals();
    const area = req.params.area;
    const all =
      area === "seattle"
        ? await allTweets(intervals)
        : await tweetsForArea(req.params.area, intervals);
    const intervalGrouper = groupByIntervalGen(intervals);
    const groups = groupBy(GroupByOptions.Nothing, all, intervals);
    const result = groups
      .map(intervalGrouper)
      .map(minimizeGroup)
      .sort(sortByTotal);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const mapsController = async (req, res, next) => {
  console.log(">>> MAPS:", req.url, req.params);
  res.status(500).send(null);
};

router.get("/mostRecentId", mostRecentController);
router.get("/tweets/byArea", byAreaController);
router.get("/tweets/byType/:area?", byTypeController);
router.get("/tweets/byAreaByType", byAreabyTypeController);
router.get("/tweets/:area", forAreaController);
router.get("/history/:area", historyController);
router.get("/maps/:z/:x/:y", mapsController);

router.get("/seattle-gov", async (req, res, next) => {
  // TODO - delete
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

export default router;
