// see groupby.js
export const GroupByOptions = {
  // TODO - import from server
  Nothing: undefined,
  IncidentType: "type",
  ZipCode: "zip",
  Neighborhood: "nhood",
  TimeInterval: "time",
};

export const AreaAccessors = {
  ZipCode: ({ derived: { zip } }) => zip,
  Neighborhood: ({ derived: { nhood } }) => nhood,
};
AreaAccessors.Default = AreaAccessors.Neighborhood;
