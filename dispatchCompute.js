const path = require("path");

import {
  GroupByOptions,
  groupBy,
  generateIntervals,
  generate24HourIntervals,
  generateHistoryIntervals,
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
  statusFile,
} from "./dispatchHelpers";
import { readJSONAsync, saveFileAsync } from "./scripts/dispatch/fileUtils";
import { withCachePath } from "./scripts/dispatch/serverUtils";
import { datasetsPath } from "./scripts/dispatch/serverUtils";

export const identityFn = (v) => v;

export const cacheKey = (path, params, query) => {
  // remove trailing '/';
  // replace other '/' with '|' to avoid confusion in file names
  const pathStr = path.replace(/\/$/, "").replace(/\//g, "|");

  const paramsStr = Object.keys(params)
    .sort()
    .map((k) => `${k}:${params[k]}`)
    .join(",");

  const queryStr = Object.keys(query)
    .sort()
    .map((k) => `${k}:${query[k]}`)
    .join(",");

  return `path=${pathStr} params=${paramsStr} query=${queryStr}`;
};

export const getCachedAsync = async (key, response) => {
  console.log("getCachedAsync: ", key);
  const file = withCachePath(`${key}.json`);
  const result = await readJSONAsync(file);
  console.log(`>> Cache ${result ? "HIT" : "MISS"}: ${key}`);
  response && response.set("X-KSEA-cache-hit", result ? 1 : 0);

  return result;
};

export const getStatusAsync = async () => {
  const mostRecentId = await getMostRecentAsync();
  const intervals = generateIntervals().slice(0, 1);
  const total = (await allTweets(intervals)).length;
  const runnersStatus = await readJSONAsync(statusFile, {});
  const lastUpdated = (runnersStatus.split && runnersStatus.split.lastRun) || 0;

  const result = {
    mostRecentId,
    lastUpdated,
    total,
    env: process.env.NODE_ENV,
  };
  return result;
};

export const getEntriesForAreaAsync = async (path, params = {}, query = {}) => {
  console.log(`getEntriesForArea > ${path}`, params, query);
  const area = params.area;
  const compare = +query.compare || 0;
  if (compare > 7 || compare < 0) {
    throw "Invalid value for query param 'compare'";
  }
  const intervals = generateIntervals(compare);
  const all =
    area === "seattle"
      ? await allTweets(intervals)
      : await tweetsForArea(area, intervals);
  const minimizer = query.minimize === "true" ? minimizeGroup : identityFn;
  const filter =
    query.activeOrMajor === "true" ? filterActiveOrMajor : filterNoop;
  const hiRes = query.hiRes === "true";
  const intervalGrouper = groupByIntervalGen(intervals, hiRes);

  const result = groupBy(GroupByOptions.Nothing, all.filter(filter))
    .map(intervalGrouper)
    .map(minimizer)
    .sort(sortByTotal);
  return result;
};

export const getEntriesByAreaAsync = async (query = {}) => {
  const intervals = generateIntervals();
  const filter =
    query.activeOrMajor === "true" ? filterActiveOrMajor : filterNoop;
  const byArea = await tweetsByArea(intervals, filter);
  const minimizer = query.minimize === "true" ? minimizeGroup : identityFn;
  const intervalGrouper = groupByIntervalGen(intervals);

  const result = byArea.map(intervalGrouper).map(minimizer).sort(sortByTotal);
  return result;
};

export const getEntriesByTypeAsync = async (params = {}, query = {}) => {
  const intervals = generateIntervals();
  const byType = await tweetsByType(params.area, intervals);
  const minimizer = query.minimize === "true" ? minimizeGroup : identityFn;
  const intervalGrouper = groupByIntervalGen(intervals);

  const result = byType.map(intervalGrouper).map(minimizer).sort(sortByTotal);
  return result;
};

export const getMajorAsync = async (query = {}) => {
  const intervals = generateIntervals();
  const all = await allTweets(intervals);
  const minimizer = query.minimize === "true" ? minimizeGroup : identityFn;
  const intervalGrouper = groupByIntervalGen(intervals);

  const result = groupBy(GroupByOptions.Nothing, all.filter(filterSev1))
    .map(intervalGrouper)
    .map(minimizer)
    .sort(sortByTotal);
  return result;
};

export const getActive24Async = async (query = {}) => {
  const intervals = generate24HourIntervals();
  const all = await allTweets(intervals);
  const minimizer = query.minimize === "true" ? minimizeGroup : identityFn;

  const intervalGrouper = groupByIntervalGen(intervals);
  const result = groupBy(GroupByOptions.Nothing, all.filter(filterActive))
    .map(intervalGrouper)
    .map(minimizer)
    .sort(sortByTotal);
  return result;
};

export const getHistoryAsync = async () => {
  const intervals = generateHistoryIntervals();
  const all = await allTweets(intervals);
  const groups = groupBy(GroupByOptions.Nothing, all, intervals);
  const intervalGrouper = groupByIntervalGen(intervals);

  const result = groups
    .map(intervalGrouper)
    .map(minimizeGroup)
    .sort(sortByTotal);
  return result;
};

export const getAnnotationsAsync = async () => {
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
  return result;
};
