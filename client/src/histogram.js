import * as d3 from "d3";

export function histogram(values) {
  const extent = expandedExtent(values);

  const histogram = d3
    .histogram()
    .domain(extent)
    .value((d) => d.derived.timestamp)
    .thresholds(d3.timeHours(...extent, 1));

  return histogram(values);
}

function getExtent(values) {
  return d3.extent(values, (d) => d.derived.timestamp);
}

export function expandedExtent(values) {
  const extent = getExtent(values);
  return [d3.timeHour.offset(extent[0], -1), d3.timeHour.offset(extent[1], 1)];
}
