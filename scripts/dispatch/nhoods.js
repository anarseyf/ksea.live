import { geoContains } from "d3-geo";
import { readJSONAsync, saveJSONAsync, appendJSONAsync } from "./fileUtils";
import { pathToScriptsJson } from "./utils";

export const featureForPoint = ([lat, long], features) =>
  features.find((feature) => geoContains(feature, [long, lat]));

export const addNhood = (tweets, features) => {
  return tweets.map(
    ({ derived: { lat, long, nhood, nested, ...restDerived }, ...rest }) => {
      const feature = featureForPoint([lat, long], features);
      const { CRA_NAM, NEIGHBO } = (feature || {}).properties || {};
      return {
        ...rest,
        derived: {
          lat,
          long,
          ...restDerived,
          neighborhood: CRA_NAM,
          neighborhoodGroup: NEIGHBO,
        },
      };
    }
  );
};

const modifyExisting = async () => {
  const nhoods = await readJSONAsync(
    "../../client/src/dispatch/2016_seattle_cra.json"
  );
  const fileNames = [
    "../../datasets/tweets/2020-06-03T00:00:00.000Z.json",
    "../../datasets/tweets/2020-06-04T00:00:00.000Z.json",
  ];

  for (let fileName of fileNames) {
    console.log("FILE:", fileName);
    // const tweets = await readJSONAsync(pathToScriptsJson("resolved.json"), []);
    const tweets = await readJSONAsync(fileName, []);
    const result = addNhood(tweets, nhoods.features);
    const newTotal = await appendJSONAsync(
      pathToScriptsJson("resolved-nhoods.json"),
      result
    );
    console.log("TOTAL:", newTotal);
  }
};

const main = async () => {
  const interval = 7 * 1203;
  let intervalId;

  const tick = async () => {
    const tickStart = new Date();

    const nhoods = await readJSONAsync(
      "../../client/src/dispatch/2016_seattle_cra.json"
    );

    const tweets = await readJSONAsync(pathToScriptsJson("resolved.json"), []);
    const result = addNhood(tweets, nhoods.features);
    await appendJSONAsync(pathToScriptsJson("resolved-nhoods.json"), result);
    await saveJSONAsync(pathToScriptsJson("resolved.json"), []);
    const tickEnd = new Date();
    console.log(`nhoods > resolved in ${tickEnd - tickStart}ms`);
  };

  tick();
  intervalId = setInterval(tick, interval);
};

main();
