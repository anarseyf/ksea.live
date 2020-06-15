import {
  readJSONAsync,
  saveJSONAsync,
  listFilesAsync,
} from "../fileUtils";
import { pathToDatasetsOfficial } from "../serverUtils";

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

