const rp = require("request-promise");
const router = require("express").Router();
const fs = require("fs");

import { groupBy, generateIntervals } from "./server/groupby";
import { GroupByOptions } from "./server/groupByOptions";
import {
  groupByIntervalGen,
  tweetsByArea,
  sortByTotal,
  minimizeGroup,
  getMostRecentAsync,
} from "./dispatchHelpers";
import {
  identityFn,
  cacheKey,
  getCachedAsync,
  getStatusAsync,
  getEntriesForAreaAsync,
  getEntriesByAreaAsync,
  getMajorAsync,
  getActive24Async,
  getHistoryAsync,
  getAnnotationsAsync,
  getPunchCardAsync,
} from "./dispatchCompute";
import { updateOnce } from "./scripts/dispatch/official/scriptUtil";
import { withTilesPath } from "./server/serverUtils";
import { createReturn } from "typescript";

const axios = require("axios").default;

const cacheKeyForRequest = (req) => cacheKey(req.path, req.params, req.query);

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
    const key = cacheKeyForRequest(req);
    const result = (await getCachedAsync(key, res)) || (await getStatusAsync());

    res.json(result);
  } catch (e) {
    console.error("error getting mostRecentId", e);
    res.status(500).send(null);
  }
};

const forAreaController = async (req, res) => {
  try {
    const key = cacheKeyForRequest(req);
    const result =
      (await getCachedAsync(key, res)) ||
      (await getEntriesForAreaAsync(req.path, req.params, req.query));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const active24Controller = async (req, res) => {
  try {
    const key = cacheKeyForRequest(req);
    const result =
      (await getCachedAsync(key, res)) || (await getActive24Async(req.query));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const majorController = async (req, res) => {
  try {
    const key = cacheKeyForRequest(req);
    const result =
      (await getCachedAsync(key, res)) || (await getMajorAsync(req.query));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const byAreaController = async (req, res) => {
  try {
    const key = cacheKeyForRequest(req);
    const result =
      (await getCachedAsync(key, res)) ||
      (await getEntriesByAreaAsync(req.query));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const byTypeController = async (req, res) => {
  try {
    throw "TODO — Do not use this API";

    /*
    const key = cacheKeyForRequest(req);
    const result =
      (await getCachedAsync(key, res)) ||
      (await getEntriesByTypeAsync(req.params, req.query));
    res.json(result);
    */
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const byAreaByTypeController = async (req, res) => {
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
    const key = cacheKeyForRequest(req);
    const result =
      (await getCachedAsync(key, res)) || (await getHistoryAsync());
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const annotationsController = async (req, res) => {
  const key = cacheKeyForRequest(req);
  const result =
    (await getCachedAsync(key, res)) || (await getAnnotationsAsync());
  res.json(result);
};

const punchCardController = async (req, res) => {
  try {
    const key = cacheKeyForRequest(req);
    const result =
      (await getCachedAsync(key, res)) || (await getPunchCardAsync());
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

const mapsController = async (req, res) => {
  try {
    let readStream, writeStream;
    const { x, y, z, theme } = req.params;
    const minZoom = 10,
      maxZoom = 13;

    const isPhone = req.query.phone === "true";
    const r = isPhone && z < 12 ? "@1x" : "@2x";

    if (isNaN(+z) || +z < minZoom || +z > maxZoom) {
      throw `/maps: invalid zoom param: ${z}`;
    }
    if (!["light", "dark", "dusk"].includes(theme)) {
      throw `/maps: invalid theme param: ${theme}`;
    }

    const imageDir = withTilesPath(`${theme}/${z}`);
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir);
    }

    const imageNameGen = (x, y, z, r = "@1x") =>
      `${imageDir}/${z}-${x}-${y}-${r}.png`;
    const fileName = imageNameGen(x, y, z, r, theme);
    console.log(`Tile: ${fileName}`);

    if (fs.existsSync(fileName)) {
      readStream = fs.createReadStream(fileName);
    } else {
      const token =
        "nMsnktvLJ03hHw3Bk4ehaEaNPGKjBE2pLhYTEcMdFEu65cNh4nMfXhGCdEwmhD7H"; // https://www.jawg.io/lab/access-tokens

      const themeIds = {
        dark: "4cae5be4-3e61-4a5d-9543-fc158da1f1df",
        dusk: "315c4209-0550-4ecb-847e-d5d68f430628",
        light: "jawg-light",
      };

      const urlGen = (theme, x, y, z, r = "") => {
        const query = `?access-token=${token}`;
        return `https://a.tile.jawg.io/${themeIds[theme]}/${z}/${x}/${y}${r}.png${query}`;
      };
      const url = urlGen(theme, x, y, z, r);
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

const cacheControlDynamic = async (req, res, next) => {
  const freshnessSeconds = 60;
  res.set("Cache-Control", `max-age=${freshnessSeconds}`);
  next();
};

const cacheControlTiles = async (req, res, next) => {
  const freshnessSeconds = 86400;
  res.set("Cache-Control", `max-age=${freshnessSeconds}`);
  next();
};

router.use("/status", cacheControlDynamic);
router.use("/tweets/*", cacheControlDynamic);
router.use("/history/*", cacheControlDynamic);
router.use("/maps/*", cacheControlTiles);

// router.get("/update", updateController);
router.get("/status", statusController);
router.get("/tweets/active24", active24Controller);
router.get("/tweets/major", majorController);
router.get("/tweets/byArea", byAreaController);
router.get("/tweets/byType/:area?", byTypeController);
router.get("/tweets/byAreaByType", byAreaByTypeController);
router.get("/tweets/:area", forAreaController);
router.get("/history/annotations", annotationsController);
router.get("/history/", historyController);
router.get("/punchcard/", punchCardController);
router.get("/maps/:x/:y/:z/:theme", mapsController);

export default router;
