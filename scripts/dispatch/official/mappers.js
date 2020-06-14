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
