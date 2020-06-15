import {
  readJSONAsync,
  saveJSONAsync,
  appendJSONAsync,
  toUTCMidnightString,
} from "../fileUtils";
import { pathToScriptsJson, pathToDatasetsOfficial } from "../serverUtils";

export const runner = async () => {
  try {
    const start = new Date();
    const entries = await readJSONAsync(
      pathToScriptsJson("resolved-nhoods.json"),
      []
    );
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
        pathToDatasetsOfficial(`${fileName}.json`),
        splits[fileName],
        { dedupe: true }
      );
    });
    await saveJSONAsync(pathToScriptsJson("resolved-nhoods.json"), []);
    const end = new Date();
    console.log(
      `split > split ${entries.length} entries across ${
        Object.keys(splits).length
      } files (${end - start}ms)`
    );
  } catch (e) {
    console.error("split >>> stopped due to error:", e);
  }
};
