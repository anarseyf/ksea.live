import * as d3 from "d3";

const defaultAccessor = (d) => d.derived.timestamp;

export function histogram(
  values,
  { cumulative = false, accessor = defaultAccessor } = {}
) {
  const extent = expandedExtent(values);

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

function getExtent(values, accessor) {
  return d3.extent(values, accessor);
}

export function expandedExtent(values, { accessor = defaultAccessor } = {}) {
  const extent = getExtent(values, accessor);
  return [d3.timeHour.offset(extent[0], -1), d3.timeHour.offset(extent[1], 1)];
}

export function xyExtents(datasets) {
  const xExtent = expandedExtent(datasets.map((d) => d.values).flat());

  console.log("XY EXTENTS", datasets);

  const maxY = d3.max(
    datasets
      .map((d) => d.bins)
      .flat()
      .map((bin) => bin.length)
  );
  const yExtent = [0, maxY];
  return { xExtent, yExtent };
}
