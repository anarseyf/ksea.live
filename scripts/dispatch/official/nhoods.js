import {
  readJSONAsync,
  saveJSONAsync,
  appendJSONAsync,
} from "../../../fileUtils";
import {
  withScriptsJsonPath,
  withGeojsonPath,
} from "../../../server/serverUtils";
import { addNhood } from "./mappers";

const targetFile = withScriptsJsonPath("nhoods.json");
const neighborhoodsFile = withGeojsonPath("2016_seattle_cra.json");

export const runner = async (sourceFile) => {
  if (!sourceFile) {
    throw "nhoods > No source file provided";
  }

  const start = new Date();

  const nhoods = await readJSONAsync(neighborhoodsFile);

  const entries = await readJSONAsync(sourceFile, []);
  if (!entries.length) {
    console.log("nhoods > nothing to do");
    return targetFile;
  }

  const result = addNhood(entries, nhoods.features);
  await appendJSONAsync(targetFile, result);
  await saveJSONAsync(sourceFile, []);
  const end = new Date();
  console.log(`nhoods > resolved in ${end - start}ms`);
  return targetFile;
};
