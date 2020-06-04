const fs = require("fs");
const util = require("util");
const axios = require("axios").default;

const touch = (fileName) => {
  // https://remarkablemark.org/blog/2017/12/17/touch-file-nodejs/
  try {
    fs.utimesSync(fileName, time, time);
  } catch (err) {
    fs.closeSync(fs.openSync(fileName, "w"));
    console.log(`>>> Created file ${fileName}`);
  }
};

const readFileAsync = async (fileName, defaultValue) => {
  try {
    // touch(fileName);
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

const saveFileAsync = async (fileName, data) => {
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(fileName, JSON.stringify(data, null, 2));
};

const dedupe = (tweets) => {
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

const fetchNew = () => {
  const bearer = process.env.BEARER;
  if (!bearer) {
    console.error("No Bearer token, cannot auth");
    return;
  }
  console.log(`Bearer: ...${bearer.slice(bearer.length - 8)}`);

  const delay = 5 * 1000;
  const tick = async () => {
    try {
      const status = await readFileAsync("status.json", {});

      const config = {
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
        params: {
          screen_name: "SeaFDIncidents",
          exclude_replies: true,
          trim_user: true,
          count: 2,
        },
      };

      if (status && status.max_id) {
        config.params.max_id = status.max_id;
      }

      console.log(
        `Fetching ${2} with max_id ${config.params.max_id} (${+config.params
          .max_id})...`
      );

      const res = await axios
        .get("https://api.twitter.com/1.1/statuses/user_timeline.json", config)
        .catch((e) => {
          console.error(
            "user_timeline call failed:",
            e.response.status,
            e.stack
          );
          throw e.message;
        });

      const newTweets = res.data;
      console.log(`Fetched ${newTweets.length} tweets`);

      const unprocessed = await readFileAsync("unprocessed.json", []);
      console.log(`${unprocessed.length} unprocessed`);
      const all = unprocessed.concat(newTweets);
      const result = dedupe(all);
      console.log(`>>> Sorted and deduped: ${all.length} -> ${result.length}`);

      await saveFileAsync("unprocessed.json", result);
      const lastTweet = result[result.length - 1];
      const newStatus = {
        max_id: lastTweet.id_str,
        updated: new Date().toLocaleString(),
        fetched: newTweets.length,
        total: result.length,
      };

      await saveFileAsync("status.json", newStatus);
    } catch (e) {
      console.error(e);
    }
  };
  tick();
  setInterval(tick, delay);
};

fetchNew();
