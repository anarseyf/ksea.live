const fs = require("fs");
const util = require("util");

import { GroupByOptions, groupBy, DefaultInterval } from "./server/groupby";
import { histogram } from "./server/histogram";

export const allTweets = async () => {
  const readFile = util.promisify(fs.readFile);
  const file = await readFile("./datasets/tweets.json");
  return JSON.parse(file);
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

const addHistogram = ({ values, ...rest }) => ({
  ...rest,
  values,
  bins: histogram(values, { cumulative: true }),
});

export const groupByInterval = ({ values, ...rest }) => {
  const intervals = groupBy(GroupByOptions.TimeInterval, values);

  return {
    ...rest,
    intervals: addOffsets(intervals.map(addStartEnd).map(addHistogram)),
  };
};
