import moment from "moment";
import { tz } from "moment-timezone";

const str = "6/11/2020 5:36:08 PM";
console.log(str);

const format = "MM/DD/YYYY hh:mm:ss A";
const timezone = "America/Vancouver";
const m1 = tz(str, format, timezone);
const m2 = tz(str, format, "UTC");

console.log(m1.toDate().toLocaleString());
console.log(m2.toDate().toLocaleString());

console.log(moment.tz.names());
console.log(
  moment.tz
    .names()
    .filter((v) => v.includes("America"))
    .join("\n")
);
