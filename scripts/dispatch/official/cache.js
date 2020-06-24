import { readJSONAsync, saveJSONAsync } from "../fileUtils";
import { withCachePath } from "../serverUtils";
import {
  getHistoryAsync,
  getEntriesForArea,
  cacheKey,
} from "../../../dispatchCompute";

const cacheFile = withCachePath("cache.json");

export const runner = async () => {
  const start = new Date();
  const cache = await readJSONAsync(cacheFile, {});
  const newCache = {
    ...cache,
  };

  let path = "/history";
  let params = {};
  let query = {
    minimize: "true",
  };
  let key = cacheKey(path, params, query);
  let result = await getHistoryAsync();
  newCache[key] = result;
  console.log("CACHE", key, result);

  path = "/tweets/seattle";
  params = {
    area: "seattle",
  };
  query = {
    minimize: "true",
    activeOrMajor: "false",
    compare: "6",
  };
  key = cacheKey(path, params, query);
  result = await getEntriesForArea(path, params, query);
  newCache[key] = result;
  console.log(`cache > ${key} --> `, result);

  await saveJSONAsync(cacheFile, newCache);
  const end = new Date();
  console.log(`cache > computed in ${end - start}ms`);
};

(async () => {
  await runner();
})();
