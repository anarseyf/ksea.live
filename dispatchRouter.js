const rp = require("request-promise");
const router = require("express").Router();
const fs = require("fs");

import {
  GroupByOptions,
  groupBy,
  generateHistoryIntervals,
  generateIntervals,
  generate24HourIntervals,
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
  filterActive,
  filterSev1,
} from "./dispatchHelpers";
import { readJSONAsync, listFilesAsync } from "./scripts/dispatch/fileUtils";

const axios = require("axios").default;

const identityFn = (v) => v;

const seattleGovController = async (req, res, next) => {
  // TODO - delete
  try {
    const options = {
      uri: "https://data.seattle.gov/resource/fire-911.json",
      json: true,
      qs: {
        $limit: 10,
        // $where: "date_extract_y(datetime) >= 2020",
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
};

const mostRecentController = async (req, res, next) => {
  try {
    const fileNames = await listFilesAsync(dataPath, {
      descending: true,
    });

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

const activeController = async (req, res, next) => {
  try {
    const intervals = generate24HourIntervals();
    const all = await allTweets(intervals);
    const minimizer =
      req.query.minimize === "true" ? minimizeGroup : identityFn;

    const intervalGrouper = groupByIntervalGen(intervals);
    const result = groupBy(GroupByOptions.Nothing, all.filter(filterActive))
      .map(intervalGrouper)
      .map(minimizer)
      .sort(sortByTotal);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const majorController = async (req, res, next) => {
  try {
    const intervals = generate24HourIntervals();
    const all = await allTweets(intervals);
    const minimizer =
      req.query.minimize === "true" ? minimizeGroup : identityFn;

    const intervalGrouper = groupByIntervalGen(intervals);
    const result = groupBy(GroupByOptions.Nothing, all.filter(filterSev1))
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

const annotationsController = async (req, res, next) => {
  const data = await readJSONAsync("./datasets/misc/annotations.json", []);

  const start2020 = new Date(2020, 0);
  const result = data.map(({ start, end, ...rest }) => ({
    start: +new Date(start),
    end: +new Date(end),
    offset: start2020 - new Date(new Date(start).getFullYear(), 0),
    ...rest,
  }));

  res.json(result);
};

const mapsController = async (req, res, next) => {
  try {
    let readStream, writeStream;
    const { s, x, y, z, r, theme } = req.params;
    const minZoom = 10,
      maxZoom = 13;
    if (isNaN(+z) || +z < minZoom || +z > maxZoom) {
      throw `/maps: invalid zoom param: ${z}`;
    }
    if (theme !== "light" && theme !== "dark") {
      throw `/maps: invalid theme param: ${theme}`;
    }

    const imageDir = `client/src/images/maps/${theme}/${z}`;
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir);
    }

    const imageNameGen = (x, y, z, r = "@1x") =>
      `${imageDir}/${z}-${x}-${y}-${r}.png`;
    const fileName = imageNameGen(x, y, z, r, theme);

    if (fs.existsSync(fileName)) {
      readStream = fs.createReadStream(fileName);
    } else {
      const token =
        "nMsnktvLJ03hHw3Bk4ehaEaNPGKjBE2pLhYTEcMdFEu65cNh4nMfXhGCdEwmhD7H"; // https://www.jawg.io/lab/access-tokens
      const urlGen = (s = "a", x, y, z, r = "") =>
        `https://${s}.tile.jawg.io/jawg-${theme}/${z}/${x}/${y}${r}.png?access-token=${token}`;
      const url = urlGen(s, x, y, z, r);
      console.log(`/maps > requesting:`, url);

      const config = {
        responseType: "stream",
        timeout: 8000,
        headers: {
          "Accept-Encoding": "gzip, deflate, br",
        },
      };
      const response = await axios.get(url, config).catch((e) => {
        console.error(">>> axios error", e.message);
        res.status(501);
      });
      readStream = response.data;
      writeStream = fs.createWriteStream(fileName);
      console.log("/maps > saving to file", fileName);
    }
    readStream.pipe(res);
    writeStream && readStream.pipe(writeStream);
  } catch (e) {
    console.error(e);
    res.status(500);
  }
};

router.get("/seattle911", seattleGovController);
router.get("/mostRecentId", mostRecentController);
router.get("/tweets/active", activeController);
router.get("/tweets/major", majorController);
router.get("/tweets/byArea", byAreaController);
router.get("/tweets/byType/:area?", byTypeController);
router.get("/tweets/byAreaByType", byAreabyTypeController);
router.get("/tweets/:area", forAreaController);
router.get("/history/annotations", annotationsController);
router.get("/history/:area", historyController);
router.get("/maps/:s/:x/:y/:z/:r/:theme?", mapsController);

export default router;
