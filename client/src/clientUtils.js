import * as d3 from "d3";
import { tz as timezone } from "moment-timezone";

export const intervalExtent = ({ start, end }, expandMinutes = 0) =>
  expand([start, end], expandMinutes);

// move to server/histogram.js
export const expand = (extent, expandMinutes = 0) => [
  d3.timeMinute.offset(extent[0], -expandMinutes),
  d3.timeMinute.offset(extent[1], expandMinutes),
];

// TODO - coordinate with section.module.scss, or find a way to use vars

const maxWidthPhone = 600;
export const getMaxWidth = () => 400; // TODO - useWindowSize()

export const isPhone = () => {
  const query = window.matchMedia(
    `only screen and (max-device-width: ${maxWidthPhone}px)`
  );
  return query.matches;
};

export const toPacificStr = (timestamp) =>
  timezone(timestamp, "America/Vancouver").format("h:mma");
