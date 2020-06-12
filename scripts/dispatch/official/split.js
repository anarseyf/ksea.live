import {
  readJSONAsync,
  saveJSONAsync,
  appendJSONAsync,
  toUTCMidnightString,
} from "../fileUtils";
import { pathToScriptsJson, pathToDatasetsOfficial } from "../utils";

const resolve = () => {
  const interval = 13 * 1231;
  let intervalId;
  const tick = async () => {
    try {
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
      console.log(
        `split > wrote ${tweets.length} items to ${
          Object.keys(splits).length
        } files`
      );
    } catch (e) {
      console.error("split >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  // tick();
  intervalId = setInterval(tick, interval);
};

resolve();
