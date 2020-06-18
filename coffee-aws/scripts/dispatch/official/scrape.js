import { appendJSONAsync, toPacificDateString } from "../fileUtils";
import { withScriptsJsonPath } from "../serverUtils";

const axios = require("axios").default;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const targetFile = withScriptsJsonPath("scraped.json");

const fetchPage = async (dateStr) => {
  const encodedDate = encodeURIComponent(dateStr);
  const url = `http://www2.seattle.gov/fire/realtime911/getRecsForDatePub.asp?incDate=${encodedDate}&rad1=des`;

  const res = await axios.get(url, {}).catch((e) => {
    console.error("user_timeline call failed:", e.response.status, e.stack);
    throw e.message;
  });
  return res.data;
};

export const scrapeDateAsync = async (dateStr) => {
  const start = new Date();
  console.log(`>> scrapeDate > ${dateStr}`);
  try {
    const html = await fetchPage(dateStr);
    const dom = new JSDOM(html);
    const { document } = dom.window;
    const rows = document
      .querySelector("tbody")
      .children[2].querySelector("tbody")
      .querySelector("tbody").children; // don't blame me...
    console.log(`>> scrapeDate > ${dateStr} rows: `, rows.length);

    const result = [...Array.from(rows)].map((row) => {
      const cells = [...Array.from(row.children)].map(
        (cell) => cell.textContent
      );
      const [date, incidentId, _, units, location, type] = cells;
      const active = row.firstElementChild.classList.contains("active");
      return {
        date,
        incidentId,
        units,
        location,
        type,
        active,
      };
    });

    const end = new Date();
    console.log(
      `>> scrapeDate > ${dateStr} -> ${result.length} (${end - start}ms)`
    );

    return result;
  } catch (e) {
    console.warn(">> scrapeDate > Warning:", e.message);
    return [];
  }
};

export const runner = async () => {
  const now = new Date();
  const year = now.getFullYear(),
    month = now.getMonth(),
    day = now.getDate();
  const dates = [];
  let offset = 0;
  let date = new Date(year, month, day + offset);
  while (date > new Date(2020, 5, 11)) {
    date = new Date(year, month, day + offset);
    offset -= 1;
    dates.push(date);
  }
  const dateStrings = dates.map(toPacificDateString);
  console.log("scrape > dates:", dateStrings);
  for (const dateStr of dateStrings) {
    await appendJSONAsync(targetFile, await scrapeDateAsync(dateStr));
  }
  const end = +new Date();
  console.log(`scrape > ${end - now}ms`);

  return targetFile;
};
