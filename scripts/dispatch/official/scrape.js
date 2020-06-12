import { checkVersion } from "../version";
import {
  readJSONAsync,
  saveJSONAsync,
  appendJSONAsync,
  toLocaleString,
} from "../fileUtils";
import { getUserTimeline, decrementIdStr, pathToScriptsJson } from "../utils";

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
  const now = new Date();
  const year = 2019,
    month = 11,
    day = 31;
  const dates = [];
  let offset = 0;
  let date = new Date(year, month, day + offset);
  while (date > new Date(2018, 11, 31)) {
    date = new Date(year, month, day + offset);
    offset -= 1;
    dates.push(date);
  }
  const dateStrings = dates.map(toLocaleString);
  console.log("scrape > dates:", dateStrings);
  for (const dateStr of dateStrings) {
    await scrapeDate(dateStr);
  }
};

checkVersion();
main();
