import * as d3 from "d3";
import { tz as timezone } from "moment-timezone";
import moment from 'moment';

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

// see also fileUtils.js
export const timeFormatter = (timestamp, format = "h:mm a") =>
  timezone(timestamp, "America/Vancouver").format(format);

export const timeFormatterHourAM = (timestamp) =>
  timeFormatter(timestamp, "h A");
export const timeFormatterMonth = (timestamp) => {
  console.log(
    `timeFormatterMonth: ${+timestamp} (${new Date(
      +timestamp
    ).toISOString()}) --> ${timeFormatter(+timestamp, "MM MMM")}`
  );
  return timeFormatter(+timestamp, "MM MMM");
};

export const timeFormatterUserTimezone = (isoDateStr) => 
  moment(isoDateStr).format("h:mm A")

const HOUR = 3600 * 1000;
export const every6Hours = (start) => [0, 6, 12, 18].map((h) => start + h * HOUR);

export const isActive = ({ derived: { active } }) => active;
export const isAtLeastSev1 = ({ derived: { severity } }) => severity >= 1;
export const isAtLeastSev2 = ({ derived: { severity } }) => severity >= 2;

export const isExactlySev1 = ({ derived: { severity } }) => severity === 1;
export const isExactlySev2 = ({ derived: { severity } }) => severity === 2;
