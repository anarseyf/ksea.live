import * as d3 from "d3";

export const intervalExtent = ({ start, end }, expandMinutes = 0) =>
  expand([start, end], expandMinutes);

// move to server/histogram.js
export const expand = (extent, expandMinutes = 0) => [
  d3.timeMinute.offset(extent[0], -expandMinutes),
  d3.timeMinute.offset(extent[1], expandMinutes),
];

export const isPhone = () => {
  const query = window.matchMedia("only screen and (max-device-width: 600px)");
  return query.matches;
};

export const isTablet = () => {
  const query = window.matchMedia("only screen and (max-device-width: 800px)");
  return query.matches;
};
