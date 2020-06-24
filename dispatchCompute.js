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

const cacheFile = withCachePath("cache.json");

export const identityFn = (v) => v;

export const cacheKey = (path, params, query) => {
  const paramsStr = Object.keys(params)
    .sort()
    .map((k) => `${k}:${params[k]}`)
    .join(",");

  const queryStr = Object.keys(query)
    .sort()
    .map((k) => `${k}=${query[k]}`)
    .join("&");

  return `${path}/${paramsStr}?${queryStr}`;
};

export const getCachedAsync = async (key) => {
  console.log("getCachedAsync: ", key);
  const cache = await readJSONAsync(cacheFile, {});
  const result = cache[key];
  console.log(`>> Cache ${result ? "HIT" : "MISS"}: ${key}`);
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

export const getEntriesForArea = async (path, params = {}, query = {}) => {
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
