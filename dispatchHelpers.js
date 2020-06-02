const fs = require("fs");
const util = require("util");

import { GroupByOptions, groupBy } from "./server/groupby";

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
export const groupByInterval = ({ values, ...rest }) => ({
  ...rest,
  intervals: groupBy(GroupByOptions.TimeInterval, values),
});
