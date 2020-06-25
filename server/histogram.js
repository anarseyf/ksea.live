import {
  sum as d3sum,
  extent as d3extent,
  histogram as d3histogram,
} from "d3-array";
import { timeHour as d3timeHour, timeMinutes as d3timeMinutes } from "d3-time";
import { isExactlySev1, isExactlySev2 } from "./serverUtils";

const defaultAccessor = ({ derived: { timestamp, offset = 0 } }) =>
  timestamp + offset;

export function histogram(
  values,
  { accessor = defaultAccessor, extent, thresholdMinutes = 60 } = {}
) {
  const histogramExtent = extent;
  expand(extent);

  const histogram = d3histogram()
    .domain(histogramExtent)
    .value(accessor)
    .thresholds(d3timeMinutes(...histogramExtent, thresholdMinutes));

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
    cumulative: d3sum(lengths.slice(0, i + 1)),
  }));

  bins = bins.map(({ x0, x1, ...rest }) => ({
    x0: +new Date(x0),
    x1: +new Date(x1),
    ...rest,
  }));

  return bins;
}

export function getExtent(values, accessor = defaultAccessor) {
  return d3extent(values, accessor);
}

const expand = (extent) => [
  d3timeHour.offset(extent[0], -1),
  d3timeHour.offset(extent[1], 1),
];
