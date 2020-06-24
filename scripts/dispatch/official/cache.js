import { readJSONAsync, saveJSONAsync } from "../fileUtils";
import { withCachePath } from "../serverUtils";
import {
  getStatusAsync,
  getHistoryAsync,
  getEntriesForAreaAsync,
  cacheKey,
} from "../../../dispatchCompute";

const cacheFile = withCachePath("cache.json");

export const runner = async () => {
  const start = new Date();
  const cache = await readJSONAsync(cacheFile, {});
  const newCache = {
    ...cache,
  };

  const variations = [
    // {
    //   path: "",
    //   params: {},
    //   query: {},
    //   asyncGetter: ,
    // },
    {
      path: "/status",
      params: {},
      query: {},
      asyncGetter: getStatusAsync,
    },
    {
      path: "/history",
      params: {},
      query: {},
      asyncGetter: getHistoryAsync,
    },
    {
      path: "/tweets/seattle",
      params: { area: "seattle" },
      query: { minimize: "true", activeOrMajor: "false", compare: "6" },
      asyncGetter: getEntriesForAreaAsync,
    },
  ];

  await Promise.all(
    variations.map(async ({ path, params, query, asyncGetter }) => {
      const key = cacheKey(path, params, query);
      const result = await asyncGetter();
      newCache[key] = result;
      console.log(`cached: ${key} --> `, result);
    })
  );

  await saveJSONAsync(cacheFile, newCache);
  const end = new Date();
  console.log(`cache > computed in ${end - start}ms`);
};

(async () => {
  await runner();
})();
