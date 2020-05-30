import * as d3 from "d3";

const defaultAccessor = ({ derived: { timestamp, offset = 0 } }) =>
  timestamp + offset;

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
  const toFlatValues = (dataset) => dataset.map(({ values }) => values).flat();
  const allValues = datasets.map(toFlatValues).flat();
  const xExtent = expandedExtent(allValues);

  const toFlatBins = (dataset) => dataset.map(({ bins }) => bins).flat();

  const maxY = d3.max(datasets.map(toFlatBins), ({ length }) => length);
  const yExtent = [0, maxY];
  return { xExtent, yExtent };
}
