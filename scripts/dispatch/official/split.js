import {
  readJSONAsync,
  saveJSONAsync,
  appendJSONAsync,
  toUTCMidnightString,
} from "../fileUtils";
import { withDatasetsPath, withScriptsJsonPath } from "../serverUtils";

export const runner = async (sourceFile) => {
  try {
    const start = new Date();
    const entries = await readJSONAsync(sourceFile, []);
    if (!entries.length) {
      console.log("split > nothing to do");
      return;
    }

    const splits = {};
    entries.forEach((t) => {
      const key = toUTCMidnightString(t.derived.timestamp);
      const list = splits[key] || [];
      list.push(t);
      splits[key] = list;
    });

    const fileNames = Object.keys(splits);
    fileNames.forEach(async (fileName) => {
      await appendJSONAsync(
        withDatasetsPath(`${fileName}.json`),
        splits[fileName],
        { merge: true }
      );
    });
    await saveJSONAsync(sourceFile, []);
    const end = new Date();
    console.log(
      `split > split ${entries.length} entries across ${
        fileNames.length
      } files (${end - start}ms) :\n`,
      fileNames
    );

    const statusFile = withScriptsJsonPath("status.json");
    const status = await readJSONAsync(statusFile, {});
    const splitStatus = { lastRun: new Date().toISOString() };
    const newStatus = { ...status, split: splitStatus };
    await saveJSONAsync(statusFile, newStatus);
  } catch (e) {
    console.error("split >>> stopped due to error:", e);
  }
};
