import { geoContains } from "d3-geo";
import { readJSONAsync, saveJSONAsync, appendJSONAsync } from "./fileUtils";
import { pathToScriptsJson } from "./utils";

export const featureForPoint = ([lat, long], features) =>
  features.find((feature) => geoContains(feature, [long, lat]));

export const addNhood = (tweets, features) => {
  return tweets.map(({ derived: { lat, long, ...restDerived }, ...rest }) => {
    const feature = featureForPoint([lat, long], features);
    const { nhood, nested } = (feature || {}).properties || {};
    return {
      ...rest,
      derived: {
        lat,
        long,
        ...restDerived,
        nhood,
        nested,
      },
    };
  });
};

const main = async () => {
  const interval = 7 * 1203;
  let intervalId;

  const tick = async () => {
    const tickStart = new Date();
    const nhoods = await readJSONAsync("../../client/src/dispatch/nhoods.json");
    const tweets = await readJSONAsync(pathToScriptsJson("resolved.json"), []);
    const result = addNhood(tweets, nhoods.features);
    const newTotal = await appendJSONAsync(
      pathToScriptsJson("resolved-nhoods.json"),
      result
    );

    await saveJSONAsync(pathToScriptsJson("resolved.json"), []);
    const tickEnd = new Date();
    console.log(
      `nhoods > resolved ${tweets.length}, new total ${newTotal} (${
        tickEnd - tickStart
      }ms)`
    );
  };
  tick();
  intervalId = setInterval(tick, interval);
};

main();
