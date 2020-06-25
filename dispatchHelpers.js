const path = require("path");

import {
  toUTCMidnightString,
  readJSONAsync,
  listFilesAsync,
} from "./fileUtils";
import { withScriptsJsonPath } from "./server/serverUtils";
import { groupBy, intervalsReducer } from "./server/groupby";
import { GroupByOptions } from "./server/groupByOptions";

export const dataPath = path.join(__dirname, "datasets/official/");
export const statusFile = withScriptsJsonPath("status.json");

const areaOption = GroupByOptions.Area;

const nextMidnight = (timestamp) => {
  const date = new Date(timestamp);
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1)
  );
};

const toFileNames = ([start, end]) => {
  const starts = [];
  for (
    let timestamp = start;
    timestamp <= end;
    timestamp = nextMidnight(timestamp)
  ) {
    starts.push(timestamp);
  }
  return starts
    .map(toUTCMidnightString)
    .map((f) => path.join(dataPath, `${f}.json`));
};

const byIntervalsGen = (intervals) => ({ derived: { timestamp } }) =>
  !!intervals.reduce(intervalsReducer(timestamp), null);

export const allTweets = async (intervals) => {
  const fileNames = [...new Set(intervals.map(toFileNames).flat())].sort();

  const files = await Promise.all(
    fileNames.map(async (f) => await readJSONAsync(f, []))
  );
  let all = files.flat(); //.filter(hasCoordinates);
  console.log(`read ${files.length} files: ${all.length} total entries`);

  const byIntervals = byIntervalsGen(intervals);

  return all.filter(byIntervals);
};

export const tweetsByType = async (area, intervals) => {
  const all =
    area === "seattle"
      ? await allTweets(intervals)
      : await tweetsForArea(area, intervals);
  return groupBy(GroupByOptions.IncidentType, all);
};

export const tweetsByArea = async (intervals, filter = filterNoop) => {
  const all = await allTweets(intervals);
  return groupBy(areaOption, all.filter(filter));
};

export const tweetsForArea = async (area, intervals) => {
  if (area === "seattle") {
    throw `Unexpected area arg in tweetsForArea: ${area}`;
  }
  const all = await allTweets(intervals);
  const grouped = groupBy(areaOption, all);
  const group = grouped.find((g) => g.key === area) || {};
  return group.values || [];
};

const trimToNow = (bins) => {
  const now = +new Date();
  return bins.filter(({ x0 }) => x0 <= now);
};

export const getMostRecentAsync = async () => {
  const fileNames = await listFilesAsync(dataPath, {
    descending: true,
  });

  let result = null;
  if (fileNames.length) {
    const mostRecentFile = fileNames[0];
    const tweets = await readJSONAsync(path.join(dataPath, mostRecentFile), []);
    if (tweets.length) {
      result = tweets[0].id_str;
    }
  }

  return result;
};

export const groupByIntervalGen = (intervals, hiRes) => ({
  values,
  ...rest
}) => {
  let byInterval = groupBy(
    GroupByOptions.TimeInterval,
    values,
    intervals,
    hiRes
  );

  byInterval[0].bins = trimToNow(byInterval[0].bins);
  byInterval[0].binsHiRes = trimToNow(byInterval[0].binsHiRes);
  byInterval[0].binsLowRes = trimToNow(byInterval[0].binsLowRes);

  return {
    ...rest,
    intervals: byInterval,
  };
};

export const sortByTotal = (a, b) =>
  b.intervals[0].total - a.intervals[0].total;

const minimizeBin = ({ x0, x1, length, cumulative, sev1, sev2 }) => ({
  x0,
  x1,
  length,
  cumulative,
  sev1,
  sev2,
});

const minimizeInterval = ({
  values, // dropped on purpose
  bins,
  binsHiRes,
  binsLowRes,
  ...rest
}) => ({
  ...rest,
  bins: bins.map(minimizeBin),
  binsHiRes: binsHiRes.map(minimizeBin),
  binsLowRes: binsLowRes.map(minimizeBin),
});

export const minimizeGroup = ({ intervals, ...rest }) => ({
  ...rest,
  intervals: intervals.map(minimizeInterval),
});

export const filterActive = ({ derived: { active } }) => active;
export const filterSev1 = ({ derived: { severity } }) => severity >= 1;
export const filterSev2 = ({ derived: { severity } }) => severity >= 2;
export const filterActiveOrMajor = ({ derived: { active, severity } }) =>
  active || severity >= 1;
export const filterNoop = (_) => true;
