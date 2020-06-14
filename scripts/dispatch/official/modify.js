import {
  readJSONAsync,
  saveJSONAsync,
  appendJSONAsync,
  listFilesAsync,
} from "../fileUtils";
import { pathToDatasetsOfficial } from "../serverUtils";
import { severityMapper } from "./mappers";

const interval = 30 * 1031;

export const modifyAll = async (mapper = (v) => v) => {
  try {
    const start = new Date();
    const path = pathToDatasetsOfficial("");
    const files = await listFilesAsync(path, { defaultValue: [] });

    files.forEach(async (fileName) => {
      const withPath = `${path}${fileName}`;
      const entries = await readJSONAsync(withPath, []);
      const result = entries.map(mapper);
      console.log(`modifyAll > ${result.length} entries in ${fileName}`);
      await saveJSONAsync(withPath, result);
    });
    const end = new Date();
    console.log(`modifyAll > (${end - start}ms)`);
  } catch (e) {
    console.error("modifyAll >>>", e);
  }
};

const main = () => {
  let intervalId;

  const tick = async () => {
    try {
      modifyAll(severityMapper);
    } catch (e) {
      console.error("modify >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  tick();
  // intervalId = setInterval(tick, interval);
};

// main();
