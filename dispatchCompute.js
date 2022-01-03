const path = require("path");

import {
  groupBy,
  generateIntervals,
  generate24HourIntervals,
  generateHistoryIntervals,
} from "./server/groupby";
import { GroupByOptions } from "./server/groupByOptions";

import {
  allTweets,
  groupByIntervalGen,
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
import { readJSONAsync, pacificWeekTuple } from "./fileUtils";
import { withCachePath, datasetsPath } from "./server/serverUtils";
import * as d3a from "d3-array";
import moment from "moment";

export const identityFn = (v) => v;

export const cacheKey = (path, params, query) => {
  // remove trailing '/';
  // replace other '/' with '|' to avoid confusion in file names
  const lastSlash = /\/$/;
  const allSlashes = /\//g;
  const pathStr = path.replace(lastSlash, "").replace(allSlashes, "|");

  const paramsStr = Object.keys(params)
    .sort()
    .map((k) => `${k}:${params[k]}`)
    .join(",")
    .replace(allSlashes, "|");

  const queryStr = Object.keys(query)
    .sort()
    .map((k) => `${k}:${query[k]}`)
    .join(",")
    .replace(allSlashes, "|");

  return `path=${pathStr} params=${paramsStr} query=${queryStr}`;
};

export const getCachedAsync = async (key, response) => {
  // console.log("getCachedAsync: ", key);
  const file = withCachePath(`${key}.json`);
  const result = await readJSONAsync(file);
  console.log(`>> Cache ${result ? "HIT" : "MISS"}: ${key}`);
  response && response.set("x-ksea-cache-hit", result ? 1 : 0);

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
  throw "TODO — Do not use this API";
  /*
  const intervals = generateIntervals();
  const byType = await tweetsByType(params.area, intervals);
  const minimizer = query.minimize === "true" ? minimizeGroup : identityFn;
  const intervalGrouper = groupByIntervalGen(intervals);

  const result = byType.map(intervalGrouper).map(minimizer).sort(sortByTotal);
  return result;
  */
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
  const yearStart = new Date(moment().year(), 0);

  let result = data.map(({ start, end, ...rest }) => ({
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
        ? yearStart - new Date(new Date((start || end).date).getFullYear(), 0)
        : undefined,
    ...rest,
  }));

  const thisYear = +new Date().getFullYear(),
    lastYear = thisYear - 1;

  console.log(JSON.stringify(result, null, 4));

  result = result.filter(({ start, end }) => {
    const tStart = start ? start.timestamp || 0 : 0;
    const tEnd = end ? end.timestamp || 0 : 0;
    const yStart = +new Date(tStart).getFullYear();
    const yEnd = +new Date(tEnd).getFullYear();
    return (
      yStart === thisYear ||
      yStart === lastYear ||
      yEnd === thisYear ||
      yEnd === lastYear
    );
  });

  console.log(JSON.stringify(result, null, 4));

  return result;
};

export const getPunchCardAsync = async () => {
  const intervals = generateHistoryIntervals().slice(0, 1);
  const all = await allTweets(intervals);

  const toTuples = ({ timestamp }) => pacificWeekTuple(timestamp);
  const tuples = all.map(toTuples); // { week, day, hour }
  const [minWeek, maxWeek] = d3a.extent(tuples, ({ week }) => week);
  const numWeeks = maxWeek - minWeek + 1;
  const zerosArray = (n) => [...new Array(n)].map(() => 0);
  const weeks = zerosArray(numWeeks).map(() =>
    zerosArray(7).map(() => zerosArray(12))
  );
  tuples.forEach(({ week, day, hour }) => {
    weeks[week - minWeek][day][hour] += 1;
  });

  const accumulator = zerosArray(7).map((_d, day) =>
    zerosArray(12).map((_h, hour2) => ({
      day,
      hour2,
      avg: 0,
      sum: 0,
      count: 0,
      // min: Infinity,
      // max: 0,
    }))
  );
  const week = weeks.reduce((acc, week) => {
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 12; hour++) {
        acc[day][hour].sum += week[day][hour];
        acc[day][hour].count += 1;
        // acc[day][hour].min = Math.min(acc[day][hour].min, week[day][hour]);
        // acc[day][hour].max = Math.max(acc[day][hour].max, week[day][hour]);
      }
    }
    return acc;
  }, accumulator);

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 12; hour++) {
      const bucket = accumulator[day][hour];
      bucket.avg = bucket.count ? bucket.sum / bucket.count : 0;
    }
  }

  let dayAggregates = zerosArray(7).map((_) => ({ sum: 0, count: 0 }));
  let hourAggregates = zerosArray(12).map((_) => ({ sum: 0, count: 0 }));

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 12; hour++) {
      const bucket = accumulator[day][hour];
      dayAggregates[day].sum += bucket.sum;
      dayAggregates[day].count += bucket.count;
      hourAggregates[hour].sum += bucket.sum;
      hourAggregates[hour].count += bucket.count;
    }
  }

  const toWeightedAvg = ({ sum, count }) => (count === 0 ? 0 : sum / count);
  dayAggregates = dayAggregates.map(toWeightedAvg);
  hourAggregates = hourAggregates.map(toWeightedAvg);

  const buckets = week.flat(2);
  const minIndex = d3a.minIndex(buckets, ({ avg }) => avg);
  const maxIndex = d3a.maxIndex(buckets, ({ avg }) => avg);

  const minBucket = buckets[minIndex];
  const maxBucket = buckets[maxIndex];
  const annotations = [
    {
      ...minBucket,
      title: "Low",
    },
    {
      ...maxBucket,
      title: "High",
    },
  ];

  // TODO - only return avg in week
  return { week, dayAggregates, hourAggregates, annotations };
};
