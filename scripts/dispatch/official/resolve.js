import { readJSONAsync, saveJSONAsync, appendJSONAsync } from "../fileUtils";
import { withScriptsJsonPath } from "../serverUtils";
import { getIncidentsMap } from "./mappers";
const axios = require("axios").default;

const queueSize = 100;

const targetFile = withScriptsJsonPath("resolved.json");
const incidentsMapFile = withScriptsJsonPath("incidentsMap.json");
const deadLetterQueue = withScriptsJsonPath("unresolved.json");

const hasCoordinates = ({ derived: { lat, long } }) =>
  typeof lat === "number" && typeof long === "number";

const hasNoCoordinates = (d) => !hasCoordinates(d);

const resolveGeo = async (entries = []) => {
  if (!entries.length) {
    console.log("resolveGeo > nothing to do");
    return [];
  }

  if (entries.length > queueSize) {
    throw `resolve > requested more than ${queueSize} items: ${entries.length}`;
  }

  const ids = entries.map(({ id_str }) => id_str);
  console.log(`resolve > IDs: ${ids}`);
  const list = ids.map((id) => `"${id}"`).join(",");
  const where = `incident_number in(${list})`;

  const appToken = "DvY4gobAudCWKcwYz3yqTd25h";

  const uri = `https://data.seattle.gov/resource/fire-911.json?$$app_token=${appToken}&$select=incident_number,latitude,longitude&$where=${where}`;
  const encodedUri = encodeURI(uri);

  console.log(`resolve > ${ids.length} ids (URI length: ${encodedUri.length})`);

  const res = await axios.get(encodedUri, {}).catch((e) => {
    console.error("data.seattle.gov call failed:", e.response.status, e.stack);
    throw e.message;
  });
  const geoData = res.data;

  const result = entries.map(({ id_str, derived, ...rest }) => {
    const { latitude, longitude, incident_number } =
      geoData.find(({ incident_number }) => id_str === incident_number) || {};

    let lat, long;
    if (incident_number) {
      lat = +latitude;
      long = +longitude;
    }

    return {
      id_str,
      ...rest,
      derived: {
        ...derived,
        lat,
        long,
      },
    };
  });

  return result;
};

const resolveLocally = async (sourceFile) => {
  const entries = await readJSONAsync(sourceFile, []);

  const incidentsMap = await readJSONAsync(incidentsMapFile, {});
  const empty = [];
  const result = entries.map(({ id_str, derived, ...rest }) => {
    const [lat, long] = incidentsMap[id_str] || empty;
    return {
      id_str,
      ...rest,
      derived: {
        ...derived,
        lat,
        long,
      },
    };
  });
  const unresolved = result.filter(hasNoCoordinates);
  await saveJSONAsync(sourceFile, unresolved);
  const resolved = result.filter(hasCoordinates);
  await appendJSONAsync(targetFile, resolved);
  console.log(
    `>> resolveLocally > resolved ${resolved.length} out of ${result.length}`
  );
};

export const runner = async (sourceFile) => {
  try {
    const start = new Date();
    let resolvedTotal = 0,
      unresolvedTotal = 0;

    await resolveLocally(sourceFile);

    for (;;) {
      const entries = await readJSONAsync(sourceFile, []);
      if (!entries.length) {
        break;
      }

      const queue = entries.slice(0, queueSize);
      if (!queue.length) {
        console.log("resolve > nothing to do");
        return;
      }

      console.log(
        `resolve > requesting ${queue.length} out of ${entries.length}`
      );

      const newData = await resolveGeo(queue);

      const resolved = newData.filter(hasCoordinates);

      const unresolved = newData.filter(hasNoCoordinates);
      unresolvedTotal = await appendJSONAsync(deadLetterQueue, unresolved, {
        merge: true,
      });
      console.log(
        `resolve > ${unresolved.length} unresolved (${unresolvedTotal} total unresolved)`
      );

      let incidentsMap = await readJSONAsync(incidentsMapFile, {});
      incidentsMap = { ...incidentsMap, ...getIncidentsMap(resolved) };
      await saveJSONAsync(incidentsMapFile, incidentsMap);

      resolvedTotal = await appendJSONAsync(targetFile, resolved);
      await saveJSONAsync(sourceFile, entries.slice(queueSize)); // TODO - atomic
    }

    const end = new Date();
    console.log(
      `resolve > new totals: resolved:${resolvedTotal},unresolved:${unresolvedTotal} (${
        end - start
      }ms)`
    );

    return targetFile;
  } catch (e) {
    console.error("resolve >>> stopped due to error:", e);
  }
};
