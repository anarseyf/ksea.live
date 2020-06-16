import { getIncidentsMap } from "./mappers";
import { runForAll } from "./scriptUtil";
import { saveJSONAsync } from "../fileUtils";
import { withScriptsJsonPath } from "../serverUtils";

const main = async () => {
  try {
    const start = new Date();
    const results = await runForAll(getIncidentsMap);
    const map = {};
    results.forEach((submap) => {
      Object.keys(submap).forEach((subkey) => {
        map[subkey] = submap[subkey];
      });
    });
    const file = withScriptsJsonPath("incidentsMap.json");
    await saveJSONAsync(file, map);
    const end = new Date();
    console.log(
      `modify > mapped ${Object.keys(map).length} incidents (${end - start}ms)`
    );
  } catch (e) {
    console.error("modify >>> ", e);
  }
};

main();
