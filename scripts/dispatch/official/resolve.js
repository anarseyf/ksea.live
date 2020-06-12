import {
  asyncTimeout,
  readJSONAsync,
  saveJSONAsync,
  appendJSONAsync,
} from "../fileUtils";
import { pathToScriptsJson } from "../utils";
const axios = require("axios").default;

const geoRateLimit = 100; // millis betweet requests

const resolveGeo = async (tweets = []) => {
  const ids = tweets.map(({ id_str }) => id_str);
  console.log(`resolve > IDs: ${ids}`);
  const where = ids.map((id) => `incident_number="${id}"`).join("+OR+");
  // console.log("WHERE:", where);
  // console.log("ENCODED:", encodeURIComponent(where));

  const appToken = "DvY4gobAudCWKcwYz3yqTd25h";

  const uri = `https://data.seattle.gov/resource/fire-911.json?$$app_token=${appToken}&$select=incident_number,latitude,longitude&$where=${where}`;
  const encodedUri = encodeURI(uri);
  console.log("ENCODED:", encodedUri);

  const res = await axios.get(encodedUri, {}).catch((e) => {
    console.error("data.seattle.gov call failed:", e.response.status, e.stack);
    throw e.message;
  });
  const result = res.data;
  console.log(result);
  return [];
};

const resolve = () => {
  const interval = 4 * 1083;
  const queueSize = 40;
  let intervalId;

  const tick = async () => {
    try {
      let queue = await readJSONAsync(
        pathToScriptsJson("resolveQueue.json"),
        []
      );
      // if (queue.length) {
      //   console.log(
      //     `resolve > ${queue.length} items in queue, will retry in ${
      //       interval / 1000
      //     } sec`
      //   );
      //   return;
      // }

      // const tweets = await readJSONAsync(
      //   pathToScriptsJson("combined.json"),
      //   []
      // );

      // queue = tweets.slice(0, queueSize);
      // await appendJSONAsync(pathToScriptsJson("resolveQueue.json"), queue);

      // Note: the queue file is not used as a source of data.
      // It might make sense to use it as a backup.

      // await saveJSONAsync(
      //   pathToScriptsJson("combined.json"),
      //   tweets.slice(queueSize)
      // ); // TODO - atomic

      console.log(`resolve > requesting ${queue.length}`);

      const hasCoordinates = ({ derived: { lat, long } }) =>
        typeof lat === "number" && typeof long === "number";

      const newData = (await resolveGeo(queue)).filter(hasCoordinates);

      const newTotal = await appendJSONAsync(
        pathToScriptsJson("resolved.json"),
        newData
      );
      // await saveJSONAsync(pathToScriptsJson("resolveQueue.json"), []);
      console.log(
        `resolve > resolved ${newData.length}, new total: ${newTotal}`
      );
    } catch (e) {
      console.error("resolve >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  tick();
  // intervalId = setInterval(tick, interval);
};

resolve();
