import * as d3 from "d3";

const defaultAccessor = ({ derived: { timestamp, offset = 0 } }) =>
  timestamp + offset;

export function histogram(
  values,
  { cumulative = false, accessor = defaultAccessor, extent } = {}
) {
  const histogramExtent = expand(getExtent(values));

  console.warn(">>> >>> TODO try import d3 histogram");

  const histogram = d3
    .histogram()
    .domain(histogramExtent)
    .value(accessor)
    .thresholds(d3.timeHours(...histogramExtent, 1));

  let bins = histogram(values);

  if (cumulative) {
    const lengths = bins.map((bin) => bin.length);
    bins = bins.map(({ length, ...bin }, i) => ({
      ...bin,
      length: i ? d3.sum(lengths.slice(0, i + 1)) : length,
    }));
  }

  console.log(">> BINS", JSON.stringify(bins, null, 2));

  bins = bins.map(({ x0, x1, ...rest }) => ({
    x0: +new Date(x0),
    x1: +new Date(x1),
    ...rest,
  }));

  return bins;
}

export function getExtent(values, accessor = defaultAccessor) {
  return d3.extent(values, accessor);
}

export const expand = (extent) => [
  d3.timeHour.offset(extent[0], -1),
  d3.timeHour.offset(extent[1], 1),
];
