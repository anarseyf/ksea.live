import { geoContains } from "d3-geo";
import { hasCoordinates } from "./scriptUtil";

export const removeSeattleWA = ({ address, ...rest }) => ({
  ...rest,
  address: address.replace(/,Seattle,WA$/, ""),
});

const featureForPoint = ([lat, long], features) =>
  features.find((feature) => geoContains(feature, [long, lat]));

export const addNhood = (entries, features) =>
  entries.map(({ lat, long, ...rest }) => {
    const feature = featureForPoint([lat, long], features);
    const { CRA_NAM, NEIGHBO } = (feature || {}).properties || {};
    return {
      ...rest,
      lat,
      long,
      neighborhood: CRA_NAM,
      neighborhoodGroup: NEIGHBO,
    };
  });

export const getIncidentsMap = (entries) => {
  const map = {};
  const filtered = entries.filter(hasCoordinates);
  filtered.forEach(({ id_str, lat, long }) => {
    map[id_str] = [lat, long];
  });
  return map;
};
