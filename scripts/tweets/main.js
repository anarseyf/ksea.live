const fs = require("fs");
const util = require("util");

// const fetch = require("node-fetch");
const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "google",
  apiKey: "AIzaSyAIaEIC_U0FePOM8GriPCEc3W9SbPjEzJM",
};

const LIMIT = 1;

const addDerived = (tweets = []) => {
  const delimiter = " - ";

  const mapper = ({ id_str, text, created_at, derived, ...rest }) => {
    const pieces = text.split(delimiter);
    const count = pieces.length;
    let description, address, units, time;
    if (count >= 4) {
      description = pieces.slice(0, count - 3).join(delimiter);
      address = `${pieces[count - 3]},Seattle,WA`;
      units = pieces[count - 2];
      time = pieces[count - 1];
    } else {
      console.warn(`Unable to parse text of tweet ${id_str}`);
    }

    return {
      id_str,
      text,
      created_at,
      ...rest,
      derived: {
        ...derived,
        timestamp: +new Date(created_at),
        description,
        address,
        units,
        time,
      },
    };
  };

  return tweets.map(mapper);
};

const getTweets = async () => {
  const readFile = util.promisify(fs.readFile);
  const file = await readFile("tweets.json");
  const tweets = JSON.parse(file).slice(0, LIMIT);

  const trimmed = trim(tweets);
  const result = addDerived(trimmed);
  return result;
};

const resolveAddresses = async (tweets = []) => {
  const geocoder = NodeGeocoder(options);
  const addresses = tweets.map((t) => t.derived.address);

  // console.log(addresses);

  const timeoutFn = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay));

  const results = await Promise.all(
    addresses.map(async (addr, i) => {
      const delay = 100 * i;
      // console.log(`>>> after ${delay}ms: ${i}: ${addr}`);
      await timeoutFn(delay);
      console.log(`>>> Starting geo resolve of #${i}`);
      return await geocoder.geocode(addr).catch((error) => {
        console.error(`>>>\tERROR in ${i}: ${error}`);
        return [];
      });
    })
  ).catch((error) => {
    console.error(`\tALL: ${error}`);
  });

  console.log(
    `>>> GEO RESOLVE: ${tweets.length} requests, ${results.length} results`
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

const readDataset = async (fileName = "dataset.json", data) => {
  const readFile = util.promisify(fs.readFile);
  const file = await readFile(fileName);
  return JSON.parse(file);
};

const saveDataset = async (fileName, data) => {
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(fileName, JSON.stringify(data, null, 2));
};

const main = async () => {
  const fromFile = "../../datasets/tweets.json",
    toFile = "../../datasets/tweets2.json";

  const tweets = await readDataset(fromFile);
  const withDerived = addDerived(tweets);

  // const hasNoZip = ({ derived: { zip } }) => !zip;
  // const noZip = trim(withDerived.filter(hasNoZip));
  // const withZip = await resolveAddresses(noZip);
  // const result = withZip;

  const result = withDerived;
  await saveDataset(toFile, result);
  console.log(`Saved ${result.length} to ${toFile}`);
};

// main();
