const fs = require("fs");
const util = require("util");

import { tz as timezone } from "moment-timezone";
import { severityMapper, markAsOld, unmarkAsOld } from "./official/mappers";
import { sortByTimestampDescending, sortNewFirst } from "./serverUtils";

const getUnits = (entries) =>
  [
    ...new Set(
      entries
        .map(({ derived: { units } }) => units)
        .join(" ")
        .split(" ")
    ),
  ]
    .sort()
    .join(" ");

const mergeSameId = (sortedEntries) => {
  const count = sortedEntries.length;
  const newest = sortedEntries[0],
    oldest = sortedEntries[count - 1];
  const units = getUnits(sortedEntries);
  const unitCount = units.split(" ").length;

  const entry = {
    id_str: oldest.id_str,
    created_at: oldest.created_at,
    derived: {
      ...oldest.derived,
      units,
      unitCount,
      active: newest.derived.active,
    },
  };

  const result = severityMapper(entry);

  if (sortedEntries.length > 1) {
    console.log(
      `>> merge > ${sortedEntries.length} : ${result.id_str} : active=${result.derived.active}`
    );
  }
  return result;
};

const mergeAll = (entries) => {
  const map = {};
  entries.forEach(({ id_str }) => {
    map[id_str] = [];
  });
  entries.forEach((entry) => {
    map[entry.id_str].push(entry);
  });

  const merged = Object.keys(map).map((key) =>
    mergeSameId(map[key].sort(sortNewFirst))
  );

  const result = merged.sort(sortByTimestampDescending);
  return result;
};

export const toUTCMidnight = (timestamp) => {
  const date = new Date(timestamp);
  const rounded = [
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  ];
  return +new Date(Date.UTC(...rounded));
};

export const toUTCMidnightString = (timestamp) =>
  new Date(toUTCMidnight(timestamp)).toISOString();

export const toPacificMidnight = (timestamp) => {
  const date = new Date(timestamp);
  const yyyymmdd = [date.getFullYear(), date.getMonth(), date.getDate()];
  return +timezone(yyyymmdd, "America/Vancouver");
};

export const toPacificDateString = (date) => {
  const moment = timezone(date, "America/Vancouver");
  return moment.format("l"); // For example "6/13/2020". See https://momentjs.com/ > Multiple Locale Support
};

export const toPacificStringMMMD = (date) => {
  const moment = timezone(date, "America/Vancouver");
  return moment.format("MMM D"); // For example "Jun 1". See https://momentjs.com/docs/#/parsing/string-format/
};

export const readJSONAsync = async (fileName, defaultValue) => {
  try {
    const readFile = util.promisify(fs.readFile);
    const file = await readFile(fileName);
    if (!file.length) {
      return defaultValue;
    }
    return JSON.parse(file);
  } catch (e) {
    // console.warn(">>> Warning:", e.message);
    return defaultValue;
  }
};

export const saveFileAsync = util.promisify(fs.writeFile);

export const saveJSONAsync = async (fileName, data) => {
  await saveFileAsync(fileName, JSON.stringify(data, null, 2));
};

export const appendJSONAsync = async (
  fileName,
  newData = [],
  { merge } = { merge: false }
) => {
  const oldData = await readJSONAsync(fileName, []);
  let result;
  if (merge) {
    result = mergeAll(oldData.map(markAsOld).concat(newData)).map(unmarkAsOld);
  } else {
    result = oldData.concat(newData);
  }
  await saveJSONAsync(fileName, result);
  return result.length;
};

export const readdirAsync = util.promisify(fs.readdir);

export const asyncTimeout = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const listFilesAsync = async (
  path,
  { descending = false, defaultValue = [] }
) => {
  try {
    const dir = await readdirAsync(path);
    let fileNames = dir.sort();
    return descending ? fileNames.reverse() : fileNames;
  } catch (e) {
    console.warn(">>> Warning:", e);
    return defaultValue;
  }
};
