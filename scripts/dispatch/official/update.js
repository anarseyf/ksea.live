import { checkVersion } from "../version";
import { toPacificDateString, listFilesAsync } from "../fileUtils";
import { scrapeDate } from "./scrape";
import moment from "moment";

const setTZ = require("set-tz");
setTZ("America/Vancouver"); // TODO - use in all scripts

const axios = require("axios").default;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const fetchPage = async (dateStr) => {
  const encodedDate = encodeURIComponent(dateStr);
  const url = `http://www2.seattle.gov/fire/realtime911/getRecsForDatePub.asp?incDate=${encodedDate}&rad1=des`;

  const res = await axios.get(url, {}).catch((e) => {
    console.error("user_timeline call failed:", e.response.status, e.stack);
    throw e.message;
  });
  return res.data;
};

const main = async () => {
  const now = +new Date();

  const path = "../../../datasets/official/";
  const fileNames = await listFilesAsync(path, { descending: true });
  const mostRecentFileName = fileNames[0].replace(/\.json$/, "");
  console.log("update > most recent: ", mostRecentFileName);
  let timestamp = +new Date(mostRecentFileName);

  const dates = [];
  do {
    dates.push(new Date(timestamp));
    timestamp = +moment(timestamp).add(1, "days");
  } while (timestamp < now);
  const dateStrings = dates.map(toPacificDateString);
  console.log("update > dates:", dateStrings);
  for (const dateStr of dateStrings) {
    await scrapeDate(dateStr);
  }
};

checkVersion();
main();
