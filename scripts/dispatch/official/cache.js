import { saveJSONAsync } from "../../../fileUtils";
import { withCachePath } from "../../../server/serverUtils";
import {
  cacheKey,
  getStatusAsync,
  getEntriesForAreaAsync,
  getEntriesByAreaAsync,
  getMajorAsync,
  getActive24Async,
  getHistoryAsync,
  getAnnotationsAsync,
} from "../../../dispatchCompute";

export const runner = async () => {
  const start = new Date();

  const areas = [
    "East",
    "Northwest",
    "Greater Duwamish",
    "Downtown",
    "Southeast",
    "Magnolia/Queen Anne",
    "Northeast",
    "Lake Union",
    "North",
    "Central",
    "Delridge Neighborhoods",
    "Ballard",
    "Southwest",
  ];

  const areaVariations1 = areas.map((area) => {
    const encodedArea = encodeURIComponent(area);
    return {
      path: `/tweets/${encodedArea}`,
      params: { area },
      query: {},
      asyncGetter: getEntriesForAreaAsync,
    };
  });
  const areaVariations2 = areas.map((area) => {
    const encodedArea = encodeURIComponent(area);
    return {
      path: `/tweets/${encodedArea}`,
      params: { area },
      query: { activeOrMajor: "true" },
      asyncGetter: getEntriesForAreaAsync,
    };
  });

  const variations = [
    {
      path: "/status",
      params: {},
      query: {},
      asyncGetter: getStatusAsync,
    },
    {
      path: "/tweets/seattle",
      params: { area: "seattle" },
      query: {},
      asyncGetter: getEntriesForAreaAsync,
    },
    {
      path: "/tweets/seattle",
      params: { area: "seattle" },
      query: { minimize: "true", compare: "6" },
      asyncGetter: getEntriesForAreaAsync,
    },
    {
      path: "/tweets/seattle",
      params: { area: "seattle" },
      query: { minimize: "true", hiRes: "true" },
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
      path: "/tweets/major",
      params: {},
      query: {},
      asyncGetter: getMajorAsync,
    },
    {
      path: "/tweets/active24",
      params: {},
      query: {},
      asyncGetter: getActive24Async,
    },
    {
      path: "/history",
      params: {},
      query: {},
      asyncGetter: getHistoryAsync,
    },
    {
      path: "/history/annotations",
      params: {},
      query: {},
      asyncGetter: getAnnotationsAsync,
    },
    ...areaVariations1,
    ...areaVariations2,
  ];

  await Promise.all(
    variations.map(async ({ path, params, query, asyncGetter }) => {
      const key = cacheKey(path, params, query);
      const result = await asyncGetter(path, params, query);
      const file = withCachePath(`${key}.json`);
      await saveJSONAsync(file, result);
      console.log(`cache > saved file: ${key}.json`);
    })
  );

  const end = new Date();
  console.log(`cache > computed in ${end - start}ms`);
};

// (async () => {
//   await runner();
// })();
