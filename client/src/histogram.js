import * as d3 from "d3";

const defaultAccessor = ({ derived: { timestamp, offset = 0 } }) =>
  timestamp + offset;

export function histogram(
  values,
  { cumulative = false, accessor = defaultAccessor } = {}
) {
  const extent = expand(getExtent(values));

  console.log("histogram/values", values);
  console.log("histogram/extent", getExtent(values), extent);

  const histogram = d3
    .histogram()
    .domain(extent)
    .value(accessor)
    .thresholds(d3.timeHours(...extent, 1));

  let hist = histogram(values);

  if (cumulative) {
    const lengths = hist.map((bin) => bin.length);
    hist = hist.map(({ length, ...bin }, i) => ({
      ...bin,
      length: i ? d3.sum(lengths.slice(0, i + 1)) : length,
    }));
  }

  return hist;
}

export function getExtent(values, accessor = defaultAccessor) {
  return d3.extent(values, accessor);
}

export const expand = (extent) => [
  d3.timeHour.offset(extent[0], -1),
  d3.timeHour.offset(extent[1], 1),
];
