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

const simulateLiveGen = (intervals) => {
  const currentStart = intervals[0][0];
  const now = new Date();
  const midnight = new Date(
    ...[now.getFullYear(), now.getMonth(), now.getDay()]
  );
  const sinceMidnight = now - midnight;
  const cutoff = currentStart + sinceMidnight;
  return ({ derived: { timestamp } }) => timestamp < cutoff;
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
  const simulateLive = simulateLiveGen(intervals); // TODO - delete

  let filtered = all.filter(byIntervals);
  const before = filtered.length;
  filtered = filtered.filter(recent);
  console.log(`FILTERED by ${mostRecent}: ${before} --> ${filtered.length}`);
  filtered = filtered.filter(simulateLive);
  return filtered;
};

export const tweetsByType = async (mostRecent) => {
  const all = await allTweets(mostRecent);
  return groupBy(GroupByOptions.IncidentType, all);
};

export const tweetsByArea = async (mostRecent) => {
  const all = await allTweets(mostRecent);
  return groupBy(GroupByOptions.ZipCode, all);
};

export const tweetsForArea = async (area, mostRecent) => {
  const all = await allTweets(mostRecent);
  const grouped = groupBy(GroupByOptions.ZipCode, all);
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

const addHistogram = ({ start, end, offset, values, ...rest }) => ({
  start,
  end,
  offset,
  ...rest,
  values,
  bins: histogram(values, { extent: [start + offset, end + offset] }),
});

export const groupByInterval = ({ values, ...rest }) => {
  let intervals = groupBy(GroupByOptions.TimeInterval, values);
  intervals = intervals.map(addStartEnd);
  intervals = addOffsets(intervals).map(addHistogram);

  return {
    ...rest,
    intervals,
  };
};
