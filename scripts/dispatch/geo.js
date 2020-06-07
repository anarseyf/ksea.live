import { geoContains } from "d3-geo";
import { readJSONAsync, saveJSONAsync } from "./fileUtils";

export const featureForPoint = ([lat, long], features) =>
  features.find((feature) => geoContains(feature, [long, lat]));

const point98109 = [47.624855, -122.3558116];
const point98144 = [47.5961455, -122.292377];

const f = (features) => {
  const f98109 = featureForPoint(point98109, features);
  console.log(point98109, f98109 ? f98109.properties : undefined);
  const f98144 = featureForPoint(point98144, features);
  console.log(point98144, f98144 ? f98144.properties : undefined);
};

const main = async () => {
  // const zipcodes = await readJSONAsync(
  //   "../../client/src/dispatch/zip-codes.json"
  // );

  // f(zipcodes.features);
  // f(nhoods.features);

  const nhoods = await readJSONAsync("../../client/src/dispatch/nhoods.json");
  const start = new Date();
  const tweets = await readJSONAsync(
    "../../datasets/tweets/2020-06-06T00:00:00.000Z.json"
  );
  const result = tweets.map(
    ({ derived: { lat, long, zip, resolvedAddress } }) => {
      const feature = featureForPoint([lat, long], nhoods.features);
      return {
        lat,
        long,
        zip,
        resolvedAddress,
        nhood: feature ? feature.properties.nhood : undefined,
      };
    }
  );
  await saveJSONAsync("nhood-test.json", result);
  const end = new Date();
  console.log(`${tweets.length} in ${end - start}ms`);
};

main();
