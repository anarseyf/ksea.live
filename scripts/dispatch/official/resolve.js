import {
  readJSONAsync,
  saveJSONAsync,
  appendJSONAsync,
} from "../../../fileUtils";
import { withScriptsJsonPath } from "../../../server/serverUtils";
import { hasCoordinates, hasNoCoordinates } from "./scriptUtil";
import { downloadIncidents, uploadIncidents } from "../database";
const axios = require("axios").default;

const SOCRATA_TOKEN = process.env.SOCRATA_TOKEN;

const queueSize = 100;

const targetFile = withScriptsJsonPath("resolved.json");
const deadLetterQueue = withScriptsJsonPath("unresolved.json");

const resolveGeo = async (entries = []) => {
  if (!entries.length) {
    console.log(">> resolveGeo > nothing to do");
    return [];
  }

  if (entries.length > queueSize) {
    throw `resolve > requested more than ${queueSize} items: ${entries.length}`;
  }

  const ids = entries.map(({ id_str }) => id_str);
  console.log(`resolve > IDs: ${ids}`);
  const list = ids.map((id) => `"${id}"`).join(",");
  const where = `incident_number in(${list})`;

  const uri = `https://data.seattle.gov/resource/kzjm-xkqj.json?$$app_token=${SOCRATA_TOKEN}&$select=incident_number,latitude,longitude&$where=${where}`;
  const encodedUri = encodeURI(uri);

  console.log(`resolve > ${ids.length} ids (URI length: ${encodedUri.length})`);

  const res = await axios.get(encodedUri, {}).catch((e) => {
    console.error(
      "data fetch call failed:",
      e && e.toString ? e.toString() : e
    );
  });

  const geoData = res ? res.data : [];

  const result = entries.map(({ id_str, ...rest }) => {
    const { latitude, longitude, incident_number } =
      geoData.find(({ incident_number }) => id_str === incident_number) || {};

    let lat, long;
    if (incident_number && latitude && longitude) {
      lat = +latitude;
      long = +longitude;
    }

    return {
      id_str,
      lat,
      long,
      ...rest,
    };
  });

  return result;
};

const resolveLocally = async (sourceFile) => {
  const entries = await readJSONAsync(sourceFile, []);

  const ids = entries.map(({ id_str }) => id_str);
  const dbEntries = await downloadIncidents(ids);

  const incidentsMap = dbEntries.reduce((map, { id, lat, long }) => {
    map[id] = [lat, long];
    return map;
  }, {});

  const empty = [];
  const result = entries.map(({ id_str, lat, long, ...rest }) => {
    const [newLat, newLong] = lat ? [lat, long] : incidentsMap[id_str] || empty;
    return {
      id_str,
      ...rest,
      lat: newLat,
      long: newLong,
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

const cleanupUnresolved = async (incidentsMap) => {
  // TODO - revisit
  const unresolved = await readJSONAsync(deadLetterQueue, []);
  const stillUnresolved = unresolved.filter(
    ({ id_str }) => !incidentsMap[id_str]
  );
  await saveJSONAsync(deadLetterQueue, stillUnresolved);
  console.log(
    `>> cleanup unresolved > ${unresolved.length} -> ${stillUnresolved.length}`
  );
  return stillUnresolved.length;
};

const saveResolved = async (entries = []) => {
  const table = entries.map(({ id_str, lat, long }) => ({
    id: id_str,
    lat,
    long,
  }));

  await uploadIncidents(table);
};

export const runner = async (sourceFile) => {
  try {
    if (!sourceFile) {
      throw "resolve > No source file provided";
    }
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
        return targetFile;
      }

      console.log(
        `resolve > requesting ${queue.length} out of ${entries.length}`
      );

      const newData = await resolveGeo(queue);

      const resolved = newData.filter(hasCoordinates);

      await saveResolved(resolved);

      const unresolved = newData.filter(hasNoCoordinates);
      await appendJSONAsync(deadLetterQueue, unresolved, {
        merge: true,
      });

      resolvedTotal = await appendJSONAsync(targetFile, newData);
      await saveJSONAsync(sourceFile, entries.slice(queueSize)); // TODO - atomic
    }

    const end = new Date();
    console.log(
      `resolve > new totals: resolved: ${resolvedTotal}, unresolved: ${unresolvedTotal} (${
        end - start
      }ms)`
    );

    return targetFile;
  } catch (e) {
    console.error("resolve >>> stopped due to error:", e);
  }
};
