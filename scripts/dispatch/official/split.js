import {
  readJSONAsync,
  saveJSONAsync,
  appendJSONAsync,
  toUTCMidnightString,
} from "../fileUtils";
import { pathToScriptsJson, pathToDatasetsOfficial } from "../utils";

const interval = 30 * 1031;

const resolve = () => {
  let intervalId;
  const tick = async () => {
    try {
      const start = new Date();
      const tweets = await readJSONAsync(
        pathToScriptsJson("resolved-nhoods.json"),
        []
      );
      const splits = {};
      tweets.forEach((t) => {
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
        `split > split ${tweets.length} entries across ${
          Object.keys(splits).length
        } files (${end - start}ms)`
      );
    } catch (e) {
      console.error("split >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  tick();
  intervalId = setInterval(tick, interval);
};

resolve();
