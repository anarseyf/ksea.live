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

const maxWidthPhone = 500;
const queryText = `only screen and (max-device-width: ${maxWidthPhone}px)`;

export const isPhone = () =>
  window ? !!window.matchMedia(queryText).matches : true;

export const toPacificStr = (timestamp) =>
  timezone(timestamp, "America/Vancouver").format("h:mma");

export const isActive = ({ derived: { active } }) => active;
export const isAtLeastSev1 = ({ derived: { severity } }) => severity >= 1;
export const isAtLeastSev2 = ({ derived: { severity } }) => severity >= 2;

export const isExactlySev1 = ({ derived: { severity } }) => severity === 1;
export const isExactlySev2 = ({ derived: { severity } }) => severity === 2;
