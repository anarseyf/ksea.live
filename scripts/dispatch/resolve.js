import {
  asyncTimeout,
  readJSONAsync,
  saveJSONAsync,
  appendJSONAsync,
} from "./fileUtils";

const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "google",
  apiKey: "AIzaSyAIaEIC_U0FePOM8GriPCEc3W9SbPjEzJM",
};

const geoRateLimit = 100; // millis betweet requests

const resolveGeo = async (tweets = []) => {
  const geocoder = NodeGeocoder(options);

  const results = await Promise.all(
    tweets.map(async ({ id_str, derived: { address } }, i) => {
      const delay = geoRateLimit * i;
      await asyncTimeout(delay);
      return await geocoder.geocode(address).catch((error) => {
        console.error(`resolve >>> ERROR in ${i}: ${error}`);
        return [];
      });
    })
  );

  console.log(
    `resolve > ${tweets.length} requests, ${
      results.filter((d) => d.length).length
    } results`
  );

  const geoResults = results
    .map((list) => list[0] || {})
    .map((d) => ({
      lat: d.latitude,
      long: d.longitude,
      resolvedAddress: d.formattedAddress,
      provider: d.provider,
      zip: d.zipcode,
    }));

  return tweets.map(({ derived, ...rest }, i) => ({
    ...rest,
    derived: {
      ...derived,
      ...geoResults[i],
    },
  }));
};

const resolve = () => {
  const interval = 3 * 1083;
  const queueSize = 20;
  let intervalId;

  const tick = async () => {
    try {
      let queue = await readJSONAsync("resolveQueue.json", []);
      if (queue.length) {
        console.log(
          `resolve > ${queue.length} items in queue, will retry in ${
            interval / 1000
          } sec`
        );
        return;
      }

      const tweets = await readJSONAsync("populated.json", []);

      queue = tweets.slice(0, queueSize);
      await appendJSONAsync("resolveQueue.json", queue);
      // Note: the queue file is not used as a source of data.
      // It might make sense to use it as a backup.
      await saveJSONAsync("populated.json", tweets.slice(queueSize)); // TODO - atomic

      console.log(
        `resolve > requesting ${queue.length} out of ${tweets.length} total`
      );

      const hasCoordinates = ({ derived: { lat, long } }) =>
        typeof lat === "number" && typeof long === "number";

      const newData = (await resolveGeo(queue)).filter(hasCoordinates);

      // console.log(
      //   "Resolved:\n",
      //   newData.map(
      //     ({ id_str, derived: { address, lat, long, zip } }) =>
      //       `${id_str}: [${Number.parseFloat(lat).toPrecision(
      //         6
      //       )},${Number.parseFloat(long).toPrecision(6)}] ${zip} : ${address}`
      //   )
      // );

      const newTotal = await appendJSONAsync("resolved.json", newData, {
        dedupe: true,
      });
      await saveJSONAsync("resolveQueue.json", []);
      console.log(
        `resolve > resolved ${newData.length}, new total: ${newTotal}`
      );
    } catch (e) {
      console.error("resolve >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  // tick();
  intervalId = setInterval(tick, interval);
};

resolve();
