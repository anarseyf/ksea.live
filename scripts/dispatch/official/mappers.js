import { geoContains } from "d3-geo";

export const severityMapper = ({
  derived: { units, ...restDerived },
  ...rest
}) => {
  const unitCount = units.split(" ").length;
  const severity = unitCount >= 10 ? 2 : unitCount >= 5 ? 1 : 0;
  return {
    ...rest,
    derived: {
      ...restDerived,
      units,
      unitCount,
      severity,
    },
  };
};

export const markAsOld = (entry) => {
  entry.derived._old = true;
  return entry;
};

export const removeSeattleWA = ({
  derived: { address, ...restDerived },
  ...rest
}) => ({
  ...rest,
  derived: {
    ...restDerived,
    address: address.replace(/,Seattle,WA$/, ""),
  },
});

const featureForPoint = ([lat, long], features) =>
  features.find((feature) => geoContains(feature, [long, lat]));

export const addNhood = (entries, features) =>
  // TODO - move to mappers.js
  entries.map(({ derived: { lat, long, ...restDerived }, ...rest }) => {
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
  });

export const getIncidentsMap = (entries) => {
  const map = {};
  entries.forEach(({ id_str, derived: { lat, long } }) => {
    map[id_str] = [lat, long];
  });
  return map;
};
