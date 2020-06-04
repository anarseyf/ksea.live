import { readFileAsync, saveFileAsync, appendToFileAsync } from "./fileUtils";

const toUTCMidnight = ({ derived: { timestamp } }) => {
  const date = new Date(timestamp);
  const rounded = [
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  ];
  const midnightUTC = new Date(Date.UTC(...rounded));
  return midnightUTC.toISOString();
};

const resolve = () => {
  const interval = 3 * 1231;
  let intervalId;
  const tick = async () => {
    try {
      const tweets = await readFileAsync("resolved.json", []);
      const splits = {};
      tweets.forEach((t) => {
        const key = toUTCMidnight(t);
        const list = splits[key] || [];
        list.push(t);
        splits[key] = list;
      });
      Object.keys(splits).forEach(async (fileName) => {
        await appendToFileAsync(`${fileName}.json`, splits[fileName], {
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
