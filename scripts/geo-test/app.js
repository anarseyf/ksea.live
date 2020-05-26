const fs = require("fs");
const util = require("util");
const fetch = require("node-fetch");
// const NodeGeocoder = require("node-geocoder");

// const options = {
//   provider: "openstreetmap",
// };

const resolverUrl = "https://nominatim.openstreetmap.org/search?format=json&q=";

const getTweets = async () => {
  const readFile = util.promisify(fs.readFile);
  const file = await readFile("tweets.json");
  const tweets = JSON.parse(file).slice(5, 6);

  const deriveMetadata = (d) => {
    const delimiter = " - ";
    const pieces = d.text.split(delimiter);
    const count = pieces.length;
    const description = pieces.slice(0, count - 3).join(delimiter);
    return {
      ...d,
      derived: {
        description,
        tweetAddress: `${pieces[count - 3]}, Seattle, WA`,
        units: pieces[count - 2].split(" "),
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
  // const geocoder = NodeGeocoder(options);
  const addresses = tweets.map((t) => t.derived.tweetAddress);

  console.log(addresses);

  const addr = addresses[0];
  const url = `${resolverUrl}${encodeURI(addr)}`;
  const result = await fetch(url);
  const result2 = await geocoder.geocode(addr);
  const results = [result, result2];
  /*
  const results = await Promise.all(
    addresses.map(async (addr, i) => {
      console.log(`>> resolving: ${addr}`);
      const url = `${resolverUrl}${encodeURI(addr)}`;
      console.log(`>>> ${i}: ${url}`);
      // return await geocoder.geocode(addr)
      return await fetch(url).catch((error) => {
        console.error(`\taddr ${i} error\n\t`, error);
        return [];
      });
    })
  ).catch((error) => {
    console.error(`\tALL: ${error}`);
  });
*/
  console.log("RESULTS:", results);
  return results
    .map((list) => list[0] || {})
    .map((d) => ({
      lat: d.latitude,
      long: d.longitude,
      resolvedAddress: d.formattedAddress,
    }));
};

const main = async () => {
  const tweets = await getTweets();
  console.log("TWEETS:", tweets);
  const result = await resolveAddresses(tweets);
  console.log("RESULT:", result);
};

main();
