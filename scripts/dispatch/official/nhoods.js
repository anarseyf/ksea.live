import { geoContains } from "d3-geo";
import { readJSONAsync, saveJSONAsync, appendJSONAsync } from "../fileUtils";
import { pathToScriptsJson } from "../serverUtils";

export const featureForPoint = ([lat, long], features) =>
  features.find((feature) => geoContains(feature, [long, lat]));

export const addNhood = (entries, features) => (
  // TODO - move to mappers.js
  entries.map(
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
  ));

export const runner = async () => {
  const tickStart = new Date();

  const nhoods = await readJSONAsync(
    "../../../client/src/dispatch/2016_seattle_cra.json"
  );

  const entries = await readJSONAsync(pathToScriptsJson("resolved.json"), []);
  if (!entries.length) {
    console.log("nhoods > nothing to do");
    return;
  }

  const result = addNhood(entries, nhoods.features);
  await appendJSONAsync(pathToScriptsJson("resolved-nhoods.json"), result);
  await saveJSONAsync(pathToScriptsJson("resolved.json"), []);
  const tickEnd = new Date();
  console.log(`nhoods > resolved in ${tickEnd - tickStart}ms`);
};
