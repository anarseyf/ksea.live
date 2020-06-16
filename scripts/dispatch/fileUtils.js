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
  return +timezone(yyyymmdd, "America/Vancouver");
};

export const toPacificDateString = (date) => {
  const moment = timezone(date, "America/Vancouver");
  return moment.format("l"); // https://momentjs.com/ > Multiple Locale Support
};

export const writeWithLockAsync = async (
  // TODO - does it work at all?
  fileToWrite,
  writeContent,
  fileToEmpty,
  emptyContent
) => {
  let isSuccess = false;
  const lockName = `${fileToEmpty}.lock`;
  try {
    lockfile.lock(lockName, {}, async (error) => {
      if (error) {
        console.error(`>>> Error while locking ${fileToEmpty}`, error);
        throw error;
      }
      await saveJSONAsync(fileToWrite, writeContent);
      await saveJSONAsync(fileToEmpty, emptyContent);
      isSuccess = true;
    });
    return isSuccess;
  } catch (error) {
    console.error(">>> Error in writeWithLock(): ", error);
    return isSuccess;
  } finally {
    lockfile.unlock(lockName, (error) => {
      if (error) {
        console.error(`>>> Error while unlocking ${fileToEmpty}`, error);
      }
    });
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

export const saveFileAsync = util.promisify(fs.writeFile);

export const saveJSONAsync = async (fileName, data) => {
  await saveFileAsync(fileName, JSON.stringify(data, null, 2));
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
  const map = {};
  entries.forEach(({id_str})=> { map[id_str] = []; })
};

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
