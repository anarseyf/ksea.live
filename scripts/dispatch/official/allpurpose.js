const { runForAll } = require("./scriptUtil");
const { saveJSONAsync } = require("../fileUtils");
const { withScriptsJsonPath } = require("../serverUtils");

const callback = (entries) => {
  const list = entries.filter(({ derived: { lat } }) => lat === null);

  return list;
};

(async () => {
  const lists = await runForAll(callback);
  const list = lists.flat();
  console.log(list.length, list[0]);

  // await saveJSONAsync(withScriptsJsonPath("combined.json"), list);
})();
