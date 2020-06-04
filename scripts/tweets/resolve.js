import {
  asyncTimeout,
  readFileAsync,
  saveFileAsync,
  appendToFileAsync,
} from "./fileUtils";

const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "google",
  apiKey: "AIzaSyAIaEIC_U0FePOM8GriPCEc3W9SbPjEzJM",
};

const resolveGeo = async (tweets = []) => {
  const geocoder = NodeGeocoder(options);

  const results = await Promise.all(
    tweets.map(async ({ id_str, derived: { address } }, i) => {
      const delay = 100 * i;
      await asyncTimeout(delay);
      console.log(`resolve > #${i}: ${id_str}...`);
      return await geocoder.geocode(address).catch((error) => {
        console.error(`resolve >>>\tERROR in ${i}: ${error}`);
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
  const interval = 4 * 1083;
  let intervalId;
  const tick = async () => {
    try {
      const tweets = await readFileAsync("populated.json", []);
      const hasCoordinates = ({ derived: { lat, long } }) =>
        typeof lat === "number" && typeof long === "number";
      const hasNoCoordinates = (t) => !hasCoordinates(t);
      const withCoordinates = tweets.filter(hasNoCoordinates);
      console.log(`resolve > ${withCoordinates.length} with no lat/long`);
      const newData = (await resolveGeo(withCoordinates)).filter(
        hasCoordinates
      );

      // console.log(
      //   "Resolved:\n",
      //   newData.map(
      //     ({ id_str, derived: { address, lat, long, zip } }) =>
      //       `${id_str}: [${Number.parseFloat(lat).toPrecision(
      //         6
      //       )},${Number.parseFloat(long).toPrecision(6)}] ${zip} : ${address}`
      //   )
      // );

      const newTotal = await appendToFileAsync("resolved.json", newData, {
        dedupe: true,
      });
      await saveFileAsync("populated.json", []);
      console.log(`resolve > new total: ${newTotal}`);
    } catch (e) {
      console.error("resolve >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  tick();
  intervalId = setInterval(tick, interval);
};

resolve();
