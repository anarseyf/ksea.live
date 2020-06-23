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
  const history = await getHistoryAsync();

  let params = {
    area: "seattle",
  };

  let query = {
    minimize: "true",
    activeOrMajor: "false",
    compare: "6",
  };
  let path = "/history";
  const result = await getEntriesForArea(path, query, params);
  let key = cacheKey(path, query, params);
  console.log("CACHE", key, history);

  const newCache = {
    ...cache,
  };
  newCache[key] = result;

  await saveJSONAsync(cacheFile, newCache);
  const end = new Date();
  console.log(`cache > computed in ${end - start}ms`);
};

(async () => {
  await runner();
})();
