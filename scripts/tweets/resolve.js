import { touch, readFileAsync, saveFileAsync } from "./fileUtils";

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

const resolve = () => {
  const tweets = readFileAsync("populated.js", []);
  const hasNoCoordinates = ({ derived: { lat, long } }) => !lat && !long;
  let filtered = tweets.filter(hasNoCoordinates);

  console.log(`Need resolving: ${filtered.length}`);
};

resolve();
