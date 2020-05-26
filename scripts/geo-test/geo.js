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

const main = async () => {
  const tweets = await getTweets();
  // console.log("TWEETS:", tweets);
  const result = await resolveAddresses(tweets);
  console.log(result);
  // const result = tweets;
  // const fileName = "tweetsGeo.json";
  // fs.writeFileSync(fileName, JSON.stringify(result, null, 2));
  // console.log(`Wrote ${result.length} results to ${fileName}`);
};

main();
