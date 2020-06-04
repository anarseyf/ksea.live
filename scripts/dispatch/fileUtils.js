const fs = require("fs");
const util = require("util");
const lockfile = require("lockfile");

const withPath = (fileName) => `./json/${fileName}`;

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
  const fullFileToWrite = withPath(fileToWrite);
  const fullFileToEmpty = withPath(fileToEmpty);
  let success = false;
  const lockName = `${fullFileToEmpty}.lock`;
  try {
    lockfile.lock(lockName, {}, async (error) => {
      if (error) {
        console.error(`>>> Error while locking ${fileToEmpty}`, error);
        throw error;
      }
      await saveFileAsync(fullFileToWrite, writeContent);
      await saveFileAsync(fullFileToEmpty, emptyContent);
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

export const readFileAsync = async (fileName, defaultValue) => {
  try {
    const fullFileName = withPath(fileName);
    const readFile = util.promisify(fs.readFile);
    const file = await readFile(fullFileName);
    if (!file.length) {
      return defaultValue;
    }
    return JSON.parse(file);
  } catch (e) {
    console.warn(">>> Warning:", e);
    return defaultValue;
  }
};

export const saveFileAsync = async (fileName, data) => {
  const fullFileName = withPath(fileName);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(fullFileName, JSON.stringify(data, null, 2));
};

export const appendToFileAsync = async (
  fileName,
  newData = [],
  { dedupe = true }
) => {
  const oldData = await readFileAsync(fileName, []);
  let result = oldData.concat(newData);
  if (dedupe) {
    result = sortAndDeduplicate(result);
  }
  await saveFileAsync(fileName, result);

  return result.length;
};

const sortAndDeduplicate = (tweets) => {
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
