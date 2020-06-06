import * as d3 from "d3";

export const intervalExtent = ({ start, end }) => expand([start, end]);

// move to server/histogram.js
export const expand = (extent) => [
  d3.timeHour.offset(extent[0], -1),
  d3.timeHour.offset(extent[1], 1),
];
