import { modifyAll } from "./scriptUtil";
import { withScriptsJsonPath } from "../../../server/serverUtils";
import { readJSONAsync, saveJSONAsync } from "../../../fileUtils";

const main = async () => {
  const file = withScriptsJsonPath("unresolved.json");

  const f = ({ derived, ...rest }) => ({
    ...rest,
    ...derived,
  });

  const entries = await readJSONAsync(file, []);
  await saveJSONAsync(file, entries.map(f));
};

main();
