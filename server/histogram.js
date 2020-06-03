import * as d3 from "d3";

const defaultAccessor = ({ derived: { timestamp, offset = 0 } }) =>
  timestamp + offset;

export function histogram(values, { accessor = defaultAccessor, extent } = {}) {
  const histogramExtent = extent;
  expand(extent);

  const histogram = d3
    .histogram()
    .domain(histogramExtent)
    .value(accessor)
    .thresholds(d3.timeHours(...histogramExtent, 1));

  let bins = histogram(values);

  const lengths = bins.map((bin) => bin.length);
  bins = bins.map(({ length, ...bin }, i) => ({
    ...bin,
    length,
    cumulative: d3.sum(lengths.slice(0, i + 1)),
  }));

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

const expand = (extent) => [
  d3.timeHour.offset(extent[0], -1),
  d3.timeHour.offset(extent[1], 1),
];
