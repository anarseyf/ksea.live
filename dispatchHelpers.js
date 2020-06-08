import {
  GroupByOptions,
  groupBy,
  DefaultInterval,
  generateIntervals,
  intervalsReducer,
} from "./server/groupby";
import { histogram } from "./server/histogram";
import {
  toUTCMidnightString,
  readJSONAsync,
} from "./scripts/dispatch/fileUtils";

export const dataPath = "./datasets/tweets/";

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

const recentGen = (mostRecent) => {
  return ({ id_str }) => id_str.localeCompare(mostRecent);
};

export const allTweets = async (mostRecent = 0) => {
  const intervals = generateIntervals();

  const fileNames = [...new Set(intervals.map(toFileNames).flat())].sort();
  console.log("helper > files to read", fileNames);

  const files = await Promise.all(
    fileNames.map(async (f) => await readJSONAsync(f, []))
  );
  console.log(`read ${files.length} files: ${files.map((f) => f.length)}`);
  const all = files.flat();

  const byIntervals = byIntervalsGen(intervals);
  const recent = recentGen(mostRecent);

  let filtered = all.filter(byIntervals);
  const before = filtered.length;
  filtered = filtered.filter(recent);
  console.log(`FILTERED by ${mostRecent}: ${before} --> ${filtered.length}`);
  return filtered;
};

export const tweetsByType = async (mostRecent) => {
  const all = await allTweets(mostRecent);
  return groupBy(GroupByOptions.IncidentType, all);
};

export const tweetsByArea = async (mostRecent) => {
  const all = await allTweets(mostRecent);
  return groupBy(areaOption, all);
};

export const tweetsForArea = async (area, mostRecent) => {
  const all = await allTweets(mostRecent);
  const grouped = groupBy(areaOption, all);
  const group = grouped.find((g) => g.key === area) || {};
  return group.values || [];
};

const addStartEnd = ({ key, ...restInterval }) => ({
  key,
  start: +key,
  end: +key + DefaultInterval,
  ...restInterval,
});

const addOffsets = (intervals) => {
  const valueMapper = (
    { derived: { timestamp, ...restDerived }, ...restValue },
    offset
  ) => ({
    ...restValue,
    derived: {
      timestamp,
      offset,
      ...restDerived,
    },
  });

  const start0 = intervals[0].start;

  const withOffsets = intervals.map(({ start, ...rest }) => ({
    start,
    offset: start0 - start,
    ...rest,
  }));

  const result = withOffsets.map(({ offset, values, ...rest }) => ({
    offset,
    values: values.map((v) => valueMapper(v, offset)),
    ...rest,
  }));

  return result;
};

const addTotals = ({ values, ...rest }) => ({
  values,
  total: values.length,
  ...rest,
});

const addHistograms = ({ start, end, offset, values, ...rest }) => {
  const extent = [start + offset, end + offset];
  return {
    start,
    end,
    offset,
    values,
    ...rest,
    bins: histogram(values, { extent }),
    bins15: histogram(values, { extent, thresholdMinutes: 15 }),
  };
};

const trimToNow = (bins) => {
  const now = +new Date();
  return bins.filter(({ x0 }) => x0 <= now);
};

export const groupByInterval = ({ values, ...rest }) => {
  let intervals = groupBy(GroupByOptions.TimeInterval, values);
  intervals = intervals.map(addStartEnd);
  intervals = addOffsets(intervals).map(addTotals).map(addHistograms);

  intervals[0].bins = trimToNow(intervals[0].bins);
  intervals[0].bins15 = trimToNow(intervals[0].bins15);

  return {
    ...rest,
    intervals,
  };
};

export const sortByTotal = (a, b) =>
  b.intervals[0].total - a.intervals[0].total;
