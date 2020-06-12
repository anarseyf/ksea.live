import { readJSONAsync, appendJSONAsync, saveJSONAsync } from "../fileUtils";
import { pathToScriptsJson } from "../utils";

const main = () => {
  const interval = 6 * 1231;
  let intervalId;
  const tick = async () => {
    try {
      const start = new Date();
      const entries = await readJSONAsync(
        pathToScriptsJson("scraped.json"),
        []
      );

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
            address: `${earliest.location},Seattle,WA`,
            units,
            entries: list.length,
          },
        };
      };

      const byTimestampDescending = (a, b) =>
        b.derived.timestamp - a.derived.timestamp;

      const result = Object.keys(map).map(mapper).sort(byTimestampDescending);

      await appendJSONAsync(pathToScriptsJson("combined.json"), result);
      const end = new Date();
      console.log(
        `combine > ${entries.length} --> ${result.length} (${end - start}ms)`
      );
      // await saveJSONAsync(pathToScriptsJson("scraped.json"), []);
    } catch (e) {
      console.error("combine >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  tick();
  // intervalId = setInterval(tick, interval);
};

main();
