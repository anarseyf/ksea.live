import {
  asyncTimeout,
  readJSONAsync,
  saveJSONAsync,
  appendJSONAsync,
} from "../fileUtils";
import { pathToScriptsJson } from "../utils";
const axios = require("axios").default;

const queueSize = 40;

const resolveGeo = async (entries = []) => {
  if (entries.length > queueSize) {
    throw `resolve > requested more than ${queueSize} items: ${entries.length}`;
  }
  const ids = entries.map(({ id_str }) => id_str);
  console.log(`resolve > IDs: ${ids}`);
  const where = ids.map((id) => `incident_number="${id}"`).join("+OR+");

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

const resolve = () => {
  const interval = 4 * 1083;
  let intervalId;

  const tick = async () => {
    try {
      const start = new Date();
      let queue = await readJSONAsync(
        pathToScriptsJson("resolveQueue.json"),
        []
      );

      if (!queue.length) {
        const entries = await readJSONAsync(
          pathToScriptsJson("combined.json"),
          []
        );

        queue = entries.slice(0, queueSize);
        await appendJSONAsync(pathToScriptsJson("resolveQueue.json"), queue);

        await saveJSONAsync(
          pathToScriptsJson("combined.json"),
          entries.slice(queueSize)
        ); // TODO - atomic
      }

      console.log(`resolve > requesting ${queue.length}`);

      const hasCoordinates = ({ derived: { lat, long } }) =>
        typeof lat === "number" && typeof long === "number";

      const newData = await resolveGeo(queue);
      const resolved = newData.filter(hasCoordinates);

      const unresolved = newData.filter((d) => !hasCoordinates(d));
      if (unresolved.length) {
        const unresolvedTotal = await appendJSONAsync(
          pathToScriptsJson("unresolved.json"),
          unresolved
        );
        console.log(
          `resolve > ${unresolved.length} unresolved (${unresolvedTotal} total unresolved)`
        );
      }

      const newTotal = await appendJSONAsync(
        pathToScriptsJson("resolved.json"),
        resolved
      );
      await saveJSONAsync(pathToScriptsJson("resolveQueue.json"), []);

      const end = new Date();
      console.log(
        `resolve > resolved ${resolved.length}, new total: ${newTotal} (${
          end - start
        }ms)`
      );
    } catch (e) {
      console.error("resolve >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  // tick();
  intervalId = setInterval(tick, interval);
};

resolve();
