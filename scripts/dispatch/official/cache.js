import { readJSONAsync, saveJSONAsync } from "../fileUtils";
import { withCachePath } from "../serverUtils";
import {
  getStatusAsync,
  getHistoryAsync,
  getEntriesForAreaAsync,
  getEntriesByAreaAsync,
  getEntriesByTypeAsync,
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
    // {
    //   path: "/history",
    //   params: {},
    //   query: {},
    //   asyncGetter: getHistoryAsync,
    // },
    {
      path: "/tweets/seattle",
      params: { area: "seattle" },
      query: { minimize: "true", compare: "6" },
      asyncGetter: getEntriesForAreaAsync,
    },
    {
      path: "/tweets/seattle",
      params: { area: "seattle" },
      query: { activeOrMajor: "true" },
      asyncGetter: getEntriesForAreaAsync,
    },
    {
      path: "/tweets/byArea",
      params: {},
      query: {},
      asyncGetter: getEntriesByAreaAsync,
    },
    {
      path: "/tweets/byArea",
      params: {},
      query: { activeOrMajor: "true" },
      asyncGetter: getEntriesByAreaAsync,
    },
    {
      path: "/tweets/byType/seattle",
      params: { area: "seattle" },
      query: {},
      asyncGetter: getEntriesByTypeAsync,
    },
  ];

  await Promise.all(
    variations.map(async ({ path, params, query, asyncGetter }) => {
      const key = cacheKey(path, params, query);
      const result = await asyncGetter(path, params, query);
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
