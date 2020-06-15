import { GroupByOptions, groupBy, intervalsReducer } from "./server/groupby";
import {
  toUTCMidnightString,
  readJSONAsync,
} from "./scripts/dispatch/fileUtils";

export const dataPath = "./datasets/official/";

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
  return starts.map(toUTCMidnightString).map((f) => `${dataPath}${f}.json`);
};

const byIntervalsGen = (intervals) => ({ derived: { timestamp } }) =>
  !!intervals.reduce(intervalsReducer(timestamp), null);

export const allTweets = async (intervals) => {
  const fileNames = [...new Set(intervals.map(toFileNames).flat())].sort();
  // console.log("helper > files to read", fileNames);

  const files = await Promise.all(
    fileNames.map(async (f) => await readJSONAsync(f, []))
  );
  const all = files.flat();
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

export const tweetsByArea = async (intervals) => {
  const all = await allTweets(intervals);
  return groupBy(areaOption, all);
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

export const groupByIntervalGen = (intervals) => ({ values, ...rest }) => {
  let byInterval = groupBy(GroupByOptions.TimeInterval, values, intervals);

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

const minimizeBin = ({ x0, x1, length, cumulative }) => ({
  x0,
  x1,
  length,
  cumulative,
});

const minimizeInterval = ({
  values,
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
