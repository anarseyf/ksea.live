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
  ZipCode: ({ zip }) => zip,
  Area: ({ neighborhoodGroup }) => neighborhoodGroup,
  AreaSecondary: ({ neighborhood }) => neighborhood,
};
AreaAccessors.Default = AreaAccessors.Area;
