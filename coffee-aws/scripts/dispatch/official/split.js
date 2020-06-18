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

    Object.keys(splits).forEach(async (fileName) => {
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
        Object.keys(splits).length
      } files (${end - start}ms)`
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
