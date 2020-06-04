import { asyncTimeout, readFileAsync, saveFileAsync } from "./fileUtils";

const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "google",
  apiKey: "AIzaSyAIaEIC_U0FePOM8GriPCEc3W9SbPjEzJM",
};

const resolveGeo = async (tweets = []) => {
  const geocoder = NodeGeocoder(options);
  const addresses = tweets.map(({ derived: { address } }) => address);

  const results = await Promise.all(
    tweets.map(async (({id_str,derived:{address}}, i) => {
      const delay = 100 * i;
      await asyncTimeout(delay);
      console.log(`resolve > #${i}: ${id_str}...`);
      return await geocoder.geocode(addr).catch((error) => {
        console.error(`resolve >>>\tERROR in ${i}: ${error}`);
        return [];
      });
    })
  ));

  console.log(
    `resolve > ${tweets.length} requests, ${results.length} results`
  );

  console.log(`resolve > ${results}`);

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

const TEST = [
  {
    id_str: "1268361085393960960",
    text: "Activated CO Detector - 2849 Eastlake Av E - L9 - 6:14",
    created_at: "Thu Jun 04 01:57:02 +0000 2020",
    derived: {
      timestamp: 1591235822000,
      description: "Activated CO Detector",
      address: "2849 Eastlake Av E,Seattle,WA",
      units: "L9",
      time: "6:14",
    },
  },
  {
    id_str: "1268361084647473153",
    text: "Medic Response - 5218 17th Av Ne - E17 M18 - 6:54",
    created_at: "Thu Jun 04 01:57:02 +0000 2020",
    derived: {
      timestamp: 1591235822000,
      description: "Medic Response",
      address: "???",
      units: "E17 M18",
      time: "6:54",
    },
  },
];

const resolve = () => {
  const tick = async () => {
    const tweets = await readFileAsync("populated.json", []);
    const hasNoCoordinates = ({ derived: { lat, long } }) => !lat && !long;
    let filtered = tweets.filter(hasNoCoordinates);

    console.log(`Need resolving: ${filtered.length}`);

    const result = await resolveGeo(TEST);
    console.log("Resolved:", result);
  };
  tick();
};

resolve();
