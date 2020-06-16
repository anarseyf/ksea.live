const path = require("path");
import {
  readJSONAsync,
  saveJSONAsync,
  listFilesAsync,
} from "../fileUtils";
import { datasetsPath } from "../serverUtils";

import { runner as updateRunner } from "./update";
import { runner as combineRunner } from "./combine";
import { runner as resolveRunner } from "./resolve";
import { runner as nhoodsRunner } from "./nhoods";
import { runner as splitRunner } from "./split";

export const updateOnce = async(ignoreStatus) => {
  const start = new Date();
  console.log(`>> updateOnce > ${ignoreStatus ? "(ignoring status) " : " "}started`);
  let file = await updateRunner(ignoreStatus);
  file = await combineRunner(file);
  file = await resolveRunner(file);
  file = await nhoodsRunner(file);
  await splitRunner(file);
  const end = new Date();
  console.log(`>> updateOnce > ${ignoreStatus ? "(ignoring status) " : " "}finished in ${end-start}ms`);
}

export const modifyAll = async (mapper = (v) => v) => {
  try {
    const start = new Date();
    const files = await listFilesAsync(datasetsPath, { defaultValue: [] });

    files.forEach(async (fileName) => {
      const withPath = path.join(datasetsPath,fileName);
      const entries = await readJSONAsync(withPath, []);
      const result = entries.map(mapper);
      console.log(`>> modifyAll > ${result.length} entries in ${fileName}`);
      await saveJSONAsync(withPath, result);
    });
    const end = new Date();
    console.log(`>> modifyAll > (${end - start}ms)`);
  } catch (e) {
    console.error(">> modifyAll >>>", e);
  }
};

export const runForAll = async (callback) => {
  try {
    const start = new Date();
    const results = [];
    const files = await listFilesAsync(datasetsPath, { defaultValue: [] });

    await Promise.all(files.map(async (fileName) => {
      const withPath = path.join(datasetsPath,fileName);
      const entries = await readJSONAsync(withPath, []);
      console.log(`>> runForAll > ${entries.length} entries in: ${fileName}`);
      results.push(callback(entries, fileName));
    }));
    const end = new Date();
    console.log(`>> modifyAll > ${results.length} submaps (${end - start}ms)`);
    return results;
  } catch (e) {
    console.error(">> modifyAll >>>", e);
    return [];
  }
}

