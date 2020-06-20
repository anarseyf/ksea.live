const rp = require("request-promise");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");

import {
  GroupByOptions,
  groupBy,
  generateIntervals,
  generate24HourIntervals,
} from "./server/groupby";
import {
  allTweets,
  groupByIntervalGen,
  tweetsByType,
  tweetsByArea,
  tweetsForArea,
  sortByTotal,
  minimizeGroup,
  filterActive,
  filterSev1,
  filterActiveOrMajor,
  filterNoop,
  getMostRecentAsync,
  getHistoryAsync,
  statusFile,
} from "./dispatchHelpers";
import { readJSONAsync, toPacificMidnight } from "./scripts/dispatch/fileUtils";
import { updateOnce } from "./scripts/dispatch/official/scriptUtil";
import { datasetsPath } from "./scripts/dispatch/serverUtils";

const axios = require("axios").default;

const identityFn = (v) => v;

const seattleGovController = async (req, res) => {
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

    rp(options).then((json) => {
      res.json(json);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const statusController = async (req, res) => {
  try {
    const mostRecentId = await getMostRecentAsync();
    const intervals = generateIntervals().slice(0, 1);
    const total = (await allTweets(intervals)).length;
    const runnersStatus = await readJSONAsync(statusFile, {});
    const lastUpdated =
      (runnersStatus.split && runnersStatus.split.lastRun) || 0;

    const status = {
      mostRecentId,
      lastUpdated,
      total,
      env: process.env.NODE_ENV,
    };
    res.json(status);
  } catch (e) {
    console.error("error getting mostRecentId", e);
    res.status(500).send(null);
  }
};

const forAreaController = async (req, res) => {
  try {
    const intervals = generateIntervals();
    const area = req.params.area;
    const all =
      area === "seattle"
        ? await allTweets(intervals)
        : await tweetsForArea(area, intervals);
    const minimizer =
      req.query.minimize === "true" ? minimizeGroup : identityFn;
    const filter =
      req.query.activeOrMajor === "true" ? filterActiveOrMajor : filterNoop;
    const hiRes = req.query.hiRes === "true";

    const intervalGrouper = groupByIntervalGen(intervals, hiRes);
    const result = groupBy(GroupByOptions.Nothing, all.filter(filter))
      .map(intervalGrouper)
      .map(minimizer)
      .sort(sortByTotal);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const active24Controller = async (req, res) => {
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

const major24Controller = async (req, res) => {
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

const byAreaController = async (req, res) => {
  try {
    const intervals = generateIntervals();
    const filter =
      req.query.activeOrMajor === "true" ? filterActiveOrMajor : filterNoop;
    const byArea = await tweetsByArea(intervals, filter);
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

const byTypeController = async (req, res) => {
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

const byAreabyTypeController = async (req, res) => {
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

const historyController = async (req, res) => {
  try {
    const result = await getHistoryAsync();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const annotationsController = async (req, res) => {
  const annotationsPath = path.join(datasetsPath, "../misc");
  const manualFile = path.join(annotationsPath, "manualAnnotations.json");
  const generatedFile = path.join(annotationsPath, "generatedAnnotations.json");
  const manualData = await readJSONAsync(manualFile, []);
  const generatedData = await readJSONAsync(generatedFile, []);

  const data = manualData.concat(generatedData);

  const start2020 = new Date(2020, 0);
  const result = data.map(({ start, end, ...rest }) => ({
    start: start
      ? {
          ...start,
          timestamp: +new Date(start.date),
        }
      : undefined,
    end: end
      ? {
          ...end,
          timestamp: +new Date(end.date),
        }
      : undefined,
    offset:
      start || end
        ? start2020 - new Date(new Date((start || end).date).getFullYear(), 0)
        : undefined,
    ...rest,
  }));

  res.json(result);
};

const mapsController = async (req, res) => {
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

const updateController = async (req, res) => {
  const start = new Date();
  await updateOnce(true);
  const mostRecentId = await getMostRecentAsync();
  const end = new Date();
  res.json({ mostRecentId, latency: end - start });
};

router.get("/seattle911", seattleGovController);
router.get("/update", updateController);
router.get("/status", statusController);
router.get("/tweets/active24", active24Controller);
router.get("/tweets/major24", major24Controller);
router.get("/tweets/byArea", byAreaController);
router.get("/tweets/byType/:area?", byTypeController);
router.get("/tweets/byAreaByType", byAreabyTypeController);
router.get("/tweets/:area", forAreaController);
router.get("/history/annotations", annotationsController);
router.get("/history/", historyController);
router.get("/maps/:s/:x/:y/:z/:r/:theme?", mapsController);

export default router;
