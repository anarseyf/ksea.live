import * as d3 from "d3";
import { tz as timezone } from "moment-timezone";
import moment from "moment";

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

// see also fileUtils.js on server
const SeattleTimezone = "America/Vancouver";
export const timeFormatter = (timestamp, format = "h:mm A") =>
  timezone(timestamp, SeattleTimezone).format(format);

export const timeFormatterUserTimezone = (date, format = "h:mm A") =>
  timezone(date, timezone.guess()).format(format);

export const timeFormatterHourAM = (timestamp) =>
  timeFormatter(timestamp, "h A");

export const timeFormatterMonth = (timestamp) =>
  timeFormatter(+timestamp, "MMM");

export const timeFormatterMonthDay = (timestamp) =>
  timeFormatter(+timestamp, "MMM D");

export const pacificMidnight = (addDays = 0) =>
  +timezone(new Date(), SeattleTimezone).startOf("day").add(addDays, "days");

const HOUR = 3600 * 1000;
export const every6Hours = (start) =>
  [0, 6, 12, 18, 24].map((h) => start + h * HOUR); // Or use moment.add()
const months = [...new Array(12)].map((_, i) => i);
export const everyMonth = (start) => {
  const m = timezone(start, SeattleTimezone);
  return months.map((v) => m.clone().add(v, "months").toDate());
};

export const isActive = ({ derived: { active } }) => active;
export const isAtLeastSev1 = ({ derived: { severity } }) => severity >= 1;
export const isAtLeastSev2 = ({ derived: { severity } }) => severity >= 2;
export const isExactlySev1 = ({ derived: { severity } }) => severity === 1;
export const isExactlySev2 = ({ derived: { severity } }) => severity === 2;
