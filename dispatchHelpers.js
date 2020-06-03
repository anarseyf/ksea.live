const fs = require("fs");
const util = require("util");

import {
  GroupByOptions,
  groupBy,
  DefaultInterval,
  generateIntervals,
  intervalsReducer,
} from "./server/groupby";
import { histogram } from "./server/histogram";

const filterByIntervals = (tweets) => {
  const intervals = generateIntervals();
  const filter = ({ derived: { timestamp } }) =>
    !!intervals.reduce(intervalsReducer(timestamp), null);
  return tweets.filter(filter);
};

const simulateLive_TODO_Delete = (tweets) => {
  const intervals = generateIntervals();
  const currentStart = intervals[0][0];
  const now = new Date();
  const midnight = new Date(
    ...[now.getFullYear(), now.getMonth(), now.getDay()]
  );
  const sinceMidnight = now - midnight;
  const cutoff = currentStart + sinceMidnight;
  const beforeNow = ({ derived: { timestamp } }) => timestamp < cutoff;
  return tweets.filter(beforeNow);
};

export const allTweets = async () => {
  const readFile = util.promisify(fs.readFile);
  const file = await readFile("./datasets/tweets.json");
  const all = JSON.parse(file);

  let filtered = filterByIntervals(all);
  // filtered = simulateLive_TODO_Delete(filtered);

  return filtered;
};

export const tweetsForArea = async (area) => {
  const all = await allTweets();
  const grouped = groupBy(GroupByOptions.ZipCode, all);
  const group = grouped.find((g) => g.key === area) || {};
  return group.values || [];
};

export const tweetsByType = async () => {
  const all = await allTweets();
  return groupBy(GroupByOptions.IncidentType, all);
};

export const tweetsByArea = async () => {
  const all = await allTweets();
  return groupBy(GroupByOptions.ZipCode, all);
};

export const tweetsForType = async (type) => {
  const all = await allTweets();
  const grouped = groupBy(GroupByOptions.IncidentType, all);
  const group = grouped.find((g) => g.key === type) || {};
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
