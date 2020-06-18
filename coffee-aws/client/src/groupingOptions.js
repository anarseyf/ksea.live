// see groupby.js
export const GroupByOptions = {
  // TODO - import from server
  Nothing: undefined,
  IncidentType: "type",
  ZipCode: "zip",
  Area: "area",
  TimeInterval: "time",
};

export const AreaAccessors = {
  ZipCode: ({ derived: { zip } }) => zip,
  Area: ({ derived: { neighborhoodGroup } }) => neighborhoodGroup,
  AreaSecondary: ({ derived: { neighborhood } }) => neighborhood,
};
AreaAccessors.Default = AreaAccessors.Area;
