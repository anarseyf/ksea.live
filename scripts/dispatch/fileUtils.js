const fs = require("fs");
const util = require("util");
const lockfile = require("lockfile");

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
    console.warn(">>> Warning:", e);
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
  { dedupe = true } = {}
) => {
  const oldData = await readJSONAsync(fileName, []);
  let result = oldData.concat(newData);
  if (dedupe) {
    result = sortAndDedupe(result);
  }
  await saveJSONAsync(fileName, result);

  return result.length;
};

const sortAndDedupe = (tweets) => {
  const sorted = tweets.sort((a, b) => b.id_str.localeCompare(a.id_str));
  for (let i = 1; i < tweets.length; i++) {
    const current = tweets[i],
      previous = tweets[i - 1];
    if (previous && current.id_str === previous.id_str) {
      tweets[i] = undefined;
    }
  }
  return sorted.filter(Boolean);
};

export const asyncTimeout = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));
