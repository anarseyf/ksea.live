import {
  toPacificDateString,
  listFilesAsync,
  readJSONAsync,
  saveJSONAsync,
} from "../fileUtils";
import { scrapeDate } from "./scrape";
import moment from "moment";
import { pathToScriptsJson } from "../serverUtils";

const axios = require("axios").default;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const waitMinutes = 5;
const MINUTE = 60 * 1000;
const wait = waitMinutes * MINUTE;

export const runner = async () => {
  const now = +new Date();

  const statusFile = pathToScriptsJson("status.json");
  const status = await readJSONAsync(statusFile, {});
  console.log("update > status", status);
  if (now - ((status.update && status.update.lastRun) || 0) < wait) {
    console.log(`update > need to wait ${waitMinutes}min since last update`);
    return;
  }

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

  const newStatus = { ...status, update: { lastRun: +new Date() } };
  await saveJSONAsync(statusFile, newStatus);
};
