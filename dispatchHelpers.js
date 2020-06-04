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

const byIntervalsGen = (intervals) => ({ derived: { timestamp } }) =>
  !!intervals.reduce(intervalsReducer(timestamp), null);

const recentGen = (mostRecent) => {
  return ({ id_str }) => +id_str > +mostRecent; // TODO - loss of precision?
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
  const readFile = util.promisify(fs.readFile);
  const file = await readFile("./datasets/tweets.json");
  const all = JSON.parse(file);

  const intervals = generateIntervals();
  const byIntervals = byIntervalsGen(intervals);
  const recent = recentGen(mostRecent);
  const simulateLive = simulateLiveGen(intervals); // TODO - delete

  let filtered = all.filter(byIntervals);
  console.log(`BEFORE FILTER: ${filtered.length}`);
  filtered = filtered.filter(recent);
  console.log(`AFTER FILTER by ${mostRecent}: ${filtered.length}`);
  // .filter(simulateLive);
  return filtered;
};

export const tweetsForArea = async (area, mostRecent) => {
  const all = await allTweets(mostRecent);
  const grouped = groupBy(GroupByOptions.ZipCode, all);
  const group = grouped.find((g) => g.key === area) || {};
  return group.values || [];
};

export const tweetsByType = async (mostRecent) => {
  const all = await allTweets(mostRecent);
  return groupBy(GroupByOptions.IncidentType, all);
};

export const tweetsByArea = async (mostRecent) => {
  const all = await allTweets(mostRecent);
  return groupBy(GroupByOptions.ZipCode, all);
};

export const tweetsForType = async (type, mostRecent) => {
  const all = await allTweets(mostRecent);
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
