import * as d3 from "d3";
import { isExactlySev1, isExactlySev2 } from "../client/src/clientUtils";

const defaultAccessor = ({ derived: { timestamp, offset = 0 } }) =>
  timestamp + offset;

export function histogram(
  values,
  { accessor = defaultAccessor, extent, thresholdMinutes = 60 } = {}
) {
  const histogramExtent = extent;
  expand(extent);

  const histogram = d3
    .histogram()
    .domain(histogramExtent)
    .value(accessor)
    .thresholds(d3.timeMinutes(...histogramExtent, thresholdMinutes));

  let bins = histogram(values);

  let binsSev1 = histogram(values.filter(isExactlySev1));
  let binsSev2 = histogram(values.filter(isExactlySev2));

  bins.forEach((bin, i) => {
    bin.sev1 = binsSev1[i].length;
    bin.sev2 = binsSev2[i].length;
  });

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
