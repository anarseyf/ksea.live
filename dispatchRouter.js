const rp = require("request-promise");
const router = require("express").Router();

import { GroupByOptions, groupBy } from "./server/groupby";
import {
  allTweets,
  groupByInterval,
  tweetsByType,
  tweetsByArea,
  tweetsForArea,
  dataPath,
  sortByTotal,
} from "./dispatchHelpers";
import { readJSONAsync, readdirAsync } from "./scripts/dispatch/fileUtils";

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
router.get("/mostRecentId", mostRecentController);

const allTweetsController = async (req, res, next) => {
  try {
    const all = await allTweets();
    const result = groupBy(GroupByOptions.Nothing, all)
      .map(groupByInterval)
      .sort(sortByTotal);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
router.get("/tweets", allTweetsController);
router.get("/tweets/seattle", allTweetsController);

const byAreaController = async (req, res, next) => {
  try {
    const byArea = await tweetsByArea();
    const result = byArea.map(groupByInterval).sort(sortByTotal);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
router.get("/tweets/byArea", byAreaController);

const byTypeController = async (req, res, next) => {
  try {
    const byType = await tweetsByType();
    const result = byType.map(groupByInterval).sort(sortByTotal);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
router.get("/tweets/byType", byTypeController);

const byAreabyTypeController = async (req, res, next) => {
  try {
    const byArea = await tweetsByArea();
    const result = byArea.map(({ values, ...rest }) => ({
      ...rest,
      groups: groupBy(GroupByOptions.IncidentType, values)
        .map(groupByInterval)
        .sort(sortByTotal),
    }));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
router.get("/tweets/byAreaByType", byAreabyTypeController);

const forAreaController = async (req, res, next) => {
  try {
    const all = await tweetsForArea(req.params.area);
    const result = groupBy(GroupByOptions.Nothing, all)
      .map(groupByInterval)
      .sort(sortByTotal);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
router.get("/tweets/:area", forAreaController);

const mapsController = async (req, res, next) => {
  console.log(">>> MAPS:", req.url, req.params);
  res.status(500).send(null);
};
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
