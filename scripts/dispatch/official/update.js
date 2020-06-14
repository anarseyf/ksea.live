import { checkVersion } from "../version";
import {
  appendJSONAsync,
  toPacificDateString,
  toPacificMidnight,
  listFilesAsync,
} from "../fileUtils";
import { pathToScriptsJson } from "../serverUtils";
import moment from "moment";

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

const scrapeDate = async (dateStr) => {
  const start = new Date();
  const html = await fetchPage(dateStr);
  const dom = new JSDOM(html);
  const { document } = dom.window;
  const rows = document
    .querySelector("tbody")
    .children[2].querySelector("tbody")
    .querySelector("tbody").children; // don't blame me...
  console.log(`scrape > ${dateStr} rows: `, rows.length);

  const result = [...Array.from(rows)].map((row) => {
    const cells = [...Array.from(row.children)].map((cell) => cell.textContent);
    const [date, incidentId, _, units, location, type] = cells;
    // const active = row.firstElementChild.classList.contains("active");
    return {
      date,
      incidentId,
      units,
      location,
      type,
      // active,
    };
  });

  await appendJSONAsync(pathToScriptsJson("scraped.json"), result);

  const end = new Date();
  console.log(`scrape > ${dateStr} -> ${result.length} (${end - start}ms)`);
  console.log(result[0]);
};

const main = async () => {
  const now = +new Date();

  const path = "../../../datasets/official/";
  const fileNames = await listFilesAsync(path, { descending: true });
  const mostRecent = fileNames[0].replace(/\.json$/, "");
  console.log("update > most recent: ", mostRecent);
  const mostRecentMidnight = toPacificMidnight(+new Date(mostRecent));
  let timestamp = mostRecentMidnight;

  const dates = [];
  do {
    console.log("Adding:", new Date(timestamp).toLocaleString());
    dates.push(new Date(timestamp));
    timestamp = +moment(timestamp).add(1, "days");
  } while (timestamp < now);
  const dateStrings = dates.map(toPacificDateString);
  console.log("update > dates:", dateStrings);
  for (const dateStr of dateStrings) {
    // await scrapeDate(dateStr);
  }
};

checkVersion();
main();
