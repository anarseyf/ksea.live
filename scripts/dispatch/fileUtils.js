const fs = require("fs");
const util = require("util");
const lockfile = require("lockfile");

import { tz as timezone } from "moment-timezone";

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
  const moment = timezone(yyyymmdd, "America/Vancouver");
  return +moment;
};

export const toLocaleString = (date) => {
  const moment = timezone(date, "America/Vancouver");
  return moment.format("l"); // https://momentjs.com/ > Multiple Locale Support
};

export const touch = (fileName) => {
  // https://remarkablemark.org/blog/2017/12/17/touch-file-nodejs/
  try {
    fs.utimesSync(fileName, time, time);
  } catch (err) {
    fs.closeSync(fs.openSync(fileName, "w"));
    console.log(`>>> Created file ${fileName}`);
  }
};

export const writeWithLockAsync = async (
  // TODO - does it work at all?
  fileToWrite,
  writeContent,
  fileToEmpty,
  emptyContent
) => {
  let success = false;
  const lockName = `${fileToEmpty}.lock`;
  try {
    lockfile.lock(lockName, {}, async (error) => {
      if (error) {
        console.error(`>>> Error while locking ${fileToEmpty}`, error);
        throw error;
      }
      await saveJSONAsync(fileToWrite, writeContent);
      await saveJSONAsync(fileToEmpty, emptyContent);
      success = true;
    });
  } catch (error) {
    console.error(">>> Error in writeWithLock(): ", error);
  } finally {
    lockfile.unlock(lockName, (error) => {
      if (error) {
        console.error(`>>> Error while unlocking ${fileToEmpty}`, error);
      }
    });
    return success;
  }
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

export const saveJSONAsync = async (fileName, data) => {
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(fileName, JSON.stringify(data, null, 2));
};

export const appendJSONAsync = async (
  fileName,
  newData = [],
  { dedupe = false } = {}
) => {
  const oldData = await readJSONAsync(fileName, []);
  let result = oldData.concat(newData);
  if (dedupe) {
    result = sortAndDedupe(result);
  }
  await saveJSONAsync(fileName, result);

  return result.length;
};

export const readdirAsync = util.promisify(fs.readdir);

const sortAndDedupe = (entries) => {
  const sorted = entries.sort(
    (a, b) => b.derived.timestamp - a.derived.timestamp
  );
  for (let i = 1; i < entries.length; i++) {
    const current = entries[i],
      previous = entries[i - 1];
    if (previous && current.id_str === previous.id_str) {
      entries[i] = undefined;
    }
  }
  const result = sorted.filter(Boolean);
  console.log(`>> dedupe >> ${entries.length} --> ${result.length}`);
  return result;
};

export const asyncTimeout = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));
