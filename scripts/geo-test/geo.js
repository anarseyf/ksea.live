const fs = require("fs");
const util = require("util");
// const fetch = require("node-fetch");
const NodeGeocoder = require("node-geocoder");
const options = {
  provider: "google",
  apiKey: "AIzaSyAIaEIC_U0FePOM8GriPCEc3W9SbPjEzJM",
};

const limit = 1;

const getTweets = async () => {
  const readFile = util.promisify(fs.readFile);
  const file = await readFile("tweets.json");
  const tweets = JSON.parse(file).slice(0, limit);

  const deriveMetadata = (d) => {
    const delimiter = " - ";
    const pieces = d.text.split(delimiter);
    const count = pieces.length;
    const description = pieces.slice(0, count - 3).join(delimiter);
    return {
      ...d,
      derived: {
        description,
        tweetAddress: `${pieces[count - 3]},Seattle,WA`,
        units: pieces[count - 2],
        time: pieces[count - 1],
      },
    };
  };

  return tweets
    .map(({ text, created_at, id_str }) => ({
      text,
      created_at,
      id_str,
    }))
    .map(deriveMetadata);
};

const resolveAddresses = async (tweets = []) => {
  const geocoder = NodeGeocoder(options);
  const addresses = tweets.map((t) => t.derived.tweetAddress);

  // console.log(addresses);

  const timeoutFn = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay));

  const results = await Promise.all(
    addresses.map(async (addr, i) => {
      const delay = 100 * i;
      // console.log(`>>> after ${delay}ms: ${i}: ${addr}`);
      await timeoutFn(delay);
      console.log(`>>> ${i}`);
      return await geocoder.geocode(addr).catch((error) => {
        console.error(`>>>\tERROR in ${i}: ${error}`);
        return [];
      });
    })
  ).catch((error) => {
    console.error(`\tALL: ${error}`);
  });

  console.log(results);

  const geoResults = results
    .map((list) => list[0] || {})
    .map((d) => ({
      lat: d.latitude,
      long: d.longitude,
      resolvedAddress: d.formattedAddress,
      provider: d.provider,
      zipcode: d.zipcode,
    }));

  return tweets.map((tweet, i) => ({
    ...tweet,
    derived: {
      ...tweet.derived,
      ...geoResults[i],
    },
  }));
};

async function readDataset(fileName = "dataset.json", data) {
  const readFile = util.promisify(fs.readFile);
  const file = await readFile(`../../datasets/${fileName}`);
  return JSON.parse(file);
}

function addZip(tweets) {
  const result = tweets.map(
    ({ derived: { resolvedAddress, ...restDerived }, ...rest }) => {
      const len = resolvedAddress.length;
      const offset = len - ", USA".length - 5;
      let zip = resolvedAddress.slice(offset, offset + 5);
      isNaN(+zip) && (zip = "unknown");
      return {
        derived: {
          resolvedAddress,
          ...restDerived,
          zip,
        },
        ...rest,
      };
    }
  );

  return result;
}

const addTimestamp = (tweets) =>
  tweets.map(({ created_at, derived, ...rest }) => ({
    created_at,
    ...rest,

    derived: {
      timestamp: +new Date(created_at),
      ...derived,
    },
  }));

const addTweetUrl = (tweets) => {
  const screenName = "SeaFDIncidents";
  return tweets.map(({ id_str, derived, ...rest }) => ({
    id_str,
    ...rest,
    derived: {
      ...derived,
      tweetUrl: `https://twitter.com/${screenName}/status/${id_str}`,
    },
  }));
};

async function saveDataset(fileName = "dataset.json", data) {
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(`../../datasets/${fileName}`, JSON.stringify(data, null, 2));
}

const main = async () => {
  const tweets = await readDataset("tweetsGeoZipTime.json");
  const modified = addTweetUrl(tweets); //addTimestamp(addZip(tweets));
  console.log(modified[0]);
  await saveDataset("tweets.json", modified);
};

main();
