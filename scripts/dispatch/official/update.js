import {
  toPacificDateString,
  listFilesAsync,
  readJSONAsync,
  saveJSONAsync,
  appendJSONAsync,
  toPacificMidnight,
} from "../fileUtils";
import { scrapeDateAsync } from "./scrape";
import moment from "moment";
import {
  withScriptsJsonPath,
  datasetsPath,
  withDatasetsPath,
} from "../serverUtils";

const targetFile = withScriptsJsonPath("updated.json");

const waitMinutes = 5;
const MINUTE = 60 * 1000;
const wait = waitMinutes * MINUTE;

export const runner = async (ignoreStatus) => {
  const now = +new Date();

  const statusFile = withScriptsJsonPath("status.json");
  const status = await readJSONAsync(statusFile, {});
  console.log("update > status", status);
  if (!ignoreStatus) {
    if (
      now - ((status.update && +new Date(status.update.lastRun)) || 0) <
      wait
    ) {
      console.log(`update > need to wait ${waitMinutes}min since last update`);
      return;
    }
  }

  const fileNames = await listFilesAsync(datasetsPath, { descending: true });
  const mostRecentFileName = fileNames[0];
  console.log("update > most recent:", mostRecentFileName);
  console.log("update > reading:", withDatasetsPath(mostRecentFileName));
  const entries = await readJSONAsync(withDatasetsPath(mostRecentFileName), []);
  let tMostRecent = entries[0].derived.timestmap;

  let timestamp = moment(toPacificMidnight(tMostRecent)).subtract(1, "days");
  const futureMidnight = moment(toPacificMidnight(now)).add(1, "days");

  const dates = [];
  do {
    dates.push(new Date(timestamp));
    timestamp = +moment(timestamp).add(1, "days");
  } while (timestamp <= futureMidnight);

  const dateStrings = dates.map(toPacificDateString);
  console.log("update > dates:", dates);
  console.log("update > date strings:", dateStrings);
  for (const dateStr of dateStrings) {
    await appendJSONAsync(targetFile, await scrapeDateAsync(dateStr));
  }

  const newStatus = {
    ...status,
    update: { lastRun: new Date().toISOString() },
  };
  await saveJSONAsync(statusFile, newStatus);

  const end = +new Date();
  console.log(`update > ${end - now}ms`);
  return targetFile;
};
