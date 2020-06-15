import { readJSONAsync, appendJSONAsync, saveJSONAsync } from "../fileUtils";
import { pathToScriptsJson } from "../serverUtils";
import { severityMapper } from "./mappers";

const targetFile = pathToScriptsJson("combined.json");

export const runner = async (sourceFile) => {
  try {
    const start = new Date();
    const entries = await readJSONAsync(sourceFile, []);
    if (!entries.length) {
      console.log("combine > nothing to do");
      return;
    }

    const map = {};
    entries.forEach((e) => {
      const incidentId = e.incidentId;
      const list = map[incidentId] || [];
      list.push(e);
      map[incidentId] = list;
    });

    const mapper = (id) => {
      const list = map[id].sort((a, b) => a.date.localeCompare(b.date));
      const earliest = list[0];
      const latest = list[list.length - 1];
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
        created_at: earliest.date,
        id_str: earliest.incidentId,
        derived: {
          timestamp: +new Date(earliest.date),
          description: earliest.type,
          address: earliest.location,
          units,
          entries: list.length,
          active: latest.active,
        },
      };
    };

    const byTimestampDescending = (a, b) =>
      b.derived.timestamp - a.derived.timestamp;

    let result = Object.keys(map).map(mapper).sort(byTimestampDescending);

    result = result.map(severityMapper);

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
