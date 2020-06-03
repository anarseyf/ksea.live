import * as d3 from "d3";

const defaultAccessor = ({ derived: { timestamp, offset = 0 } }) =>
  timestamp + offset;

export function getExtent(values, accessor = defaultAccessor) {
  return d3.extent(values, accessor);
}

export const expand = (extent) => [
  d3.timeHour.offset(extent[0], -1),
  d3.timeHour.offset(extent[1], 1),
];

export const intervalExtent = (interval) => {
  const bins = interval.bins;
  const actual = [+new Date(bins[0].x0), +new Date(bins[bins.length - 1].x1)];
  console.log(">> ACTUAL", actual);
  return expand(actual);
};
