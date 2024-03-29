const fs = require("fs");
const util = require("util");
const path = require("path");

import { tz as timezone } from "moment-timezone";
import { sortByTimestampDescending } from "./server/serverUtils";

const getUnitsArray = (entries) =>
  [
    ...new Set(
      entries
        .map(({ units }) => units)
        .join(" ")
        .split(" ")
    ),
  ].sort();

const mergeSameId = (sortedEntries) => {
  const count = sortedEntries.length;
  const newest = sortedEntries[0];
  const unitsArray = getUnitsArray(sortedEntries);
  const units = unitsArray.join(" ");
  const unitCount = unitsArray.length;

  const [lat, long] = sortedEntries
    .map(({ lat, long }) => [lat, long])
    .reduce((acc, pair) => (acc[0] ? acc : pair), [undefined, undefined]);

  const entry = {
    ...newest,
    units,
    unitCount,
    lat,
    long,
  };

  const result = severityMapper(entry);
  return result;
};

const sortNewFirst = (a, b) => {
  const oldA = a._old,
    oldB = b._old;
  const timeA = a.timestamp,
    timeB = b.timestamp;
  if (oldA === oldB) {
    return timeB - timeA;
  }
  return oldA ? 1 : -1;
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
  timezone(toUTCMidnight(timestamp), "UTC").toISOString();

// https://momentjs.com/docs/#/parsing/string-format/
const format = "MM/DD/YYYY hh:mm:ss A";
const SeattleTimezone = "America/Vancouver";
export const localStrToTimestamp = (str) =>
  +timezone(str, format, SeattleTimezone);

export const toPacificMidnight = (timestamp) =>
  +timezone(timestamp, SeattleTimezone).startOf("day");

export const pacificYearStart = () =>
  +timezone(new Date(), SeattleTimezone).startOf("year");

export const addYear = (timestamp) =>
  +timezone(timestamp, SeattleTimezone).add(1, "year");

export const subtractYear = (timestamp) =>
  +timezone(timestamp, SeattleTimezone).subtract(1, "year");

export const toPacificDateString = (date) => {
  const moment = timezone(date, SeattleTimezone);
  return moment.format("l"); // For example "6/13/2020". See https://momentjs.com/ > Multiple Locale Support
};

export const toPacificStringMMMD = (date) => {
  const moment = timezone(date, SeattleTimezone);
  return moment.format("MMM D"); // For example "Jun 1". See https://momentjs.com/docs/#/parsing/string-format/
};

export const pacificWeekTuple = (timestamp) => {
  const m = timezone(timestamp, SeattleTimezone);
  // https://momentjs.com/docs/#/get-set/iso-weekday/
  return {
    week: m.isoWeekday() - 1,
    day: m.day(),
    hour: Math.floor(m.hour() / 2),
  };
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
    // console.warn(">>> readJSONAsync warning:", e.message);
    return defaultValue;
  }
};

export const saveFileAsync = util.promisify(fs.writeFile);

const mkdirAsync = util.promisify(fs.mkdir);

export const saveJSONAsync = async (fileName, data) => {
  const dir = path.dirname(fileName);
  await mkdirAsync(dir, { recursive: true });
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

export const severityMapper = ({ units, ...rest }) => {
  const unitCount = units.split(" ").length;
  const severity = unitCount >= 10 ? 2 : unitCount >= 5 ? 1 : 0;
  return {
    ...rest,
    units,
    unitCount,
    severity,
  };
};

const markAsOld = (entry) => {
  entry._old = true;
  return entry;
};

const unmarkAsOld = (entry) => {
  delete entry._old;
  return entry;
};
