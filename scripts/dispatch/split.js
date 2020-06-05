import {
  readJSONAsync,
  saveJSONAsync,
  appendJSONAsync,
  toUTCMidnight,
} from "./fileUtils";

const resolve = () => {
  const interval = 3 * 1231;
  let intervalId;
  const tick = async () => {
    try {
      const tweets = await readJSONAsync("resolved.json", []);
      const splits = {};
      tweets.forEach((t) => {
        const key = toUTCMidnight(t);
        const list = splits[key] || [];
        list.push(t);
        splits[key] = list;
      });
      Object.keys(splits).forEach(async (fileName) => {
        await appendJSONAsync(`${fileName}.json`, splits[fileName], {
          dedupe: true,
        });
      });
      // await saveFileAsync("resolved.json", []);
      console.log(
        `split > wrote to ${Object.keys(splits).length} files: ${Object.keys(
          splits
        )}`
      );
    } catch (e) {
      console.error("split >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  tick();
  // intervalId = setInterval(tick, interval);
};

resolve();
