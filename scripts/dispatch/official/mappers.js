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

export const removeSeattleWA = (({
  derived: { address, ...restDerived },
  ...rest
}) => ({
  ...rest,
  derived: {
    ...restDerived,
    address: address.replace(/,Seattle,WA$/,"")
  }
}));

export const getIncidentsMap = (entries) => {
  const map = {};
  entries.forEach(({id_str, derived:{lat, long}}) => {
    map[id_str] = [lat,long];
  })
  return map;
};
