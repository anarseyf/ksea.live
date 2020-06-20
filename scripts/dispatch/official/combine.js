import { readJSONAsync, appendJSONAsync, saveJSONAsync } from "../fileUtils";
import { withScriptsJsonPath, sortByTimestampDescending } from "../serverUtils";
import { severityMapper } from "./mappers";
import { tz } from "moment-timezone";

const targetFile = withScriptsJsonPath("combined.json");

// https://momentjs.com/docs/#/parsing/string-format/
const format = "MM/DD/YYYY hh:mm:ss A";
const timezone = "America/Vancouver";
const localStrToTimestamp = (str) => +tz(str, format, timezone);

export const runner = async (sourceFile) => {
  try {
    const start = new Date();
    const entries = await readJSONAsync(sourceFile, []);
    if (!entries.length) {
      console.log("combine > nothing to do");
      return targetFile;
    }

    const map = {};
    entries.forEach((e) => {
      const incidentId = e.incidentId;
      const list = map[incidentId] || [];
      list.push(e);
      map[incidentId] = list;
    });

    const mapper = (id) => {
      const list = map[id].sort(
        (a, b) => localStrToTimestamp(a.date) - localStrToTimestamp(b.date)
      );
      const oldest = list[0];
      const newest = list[list.length - 1];
      const units = [
        ...new Set(
          list
            .map(({ units }) => units)
            .join(" ")
            .split(" ")
        ),
      ]
        .sort()
        .join(" ");

      return {
        // TODO - mostly redundant with merge @ split stage
        created_at: oldest.date,
        id_str: oldest.incidentId,
        derived: {
          timestamp: localStrToTimestamp(oldest.date),
          description: oldest.type,
          address: oldest.location,
          units,
          active: newest.active,
        },
      };
    };

    const result = Object.keys(map)
      .map(mapper)
      .sort(sortByTimestampDescending)
      .map(severityMapper);

    await appendJSONAsync(targetFile, result);
    const end = new Date();
    console.log(
      `combine > ${entries.length} --> ${result.length} (${end - start}ms)`
    );
    await saveJSONAsync(sourceFile, []);
    return targetFile;
  } catch (e) {
    console.error("combine >>> Canceling runner due to error:", e);
  }
};
