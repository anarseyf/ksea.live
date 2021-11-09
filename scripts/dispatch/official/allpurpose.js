const path = require("path");
import { datasetsPath } from "../../../server/serverUtils";
import { readJSONAsync, listFilesAsync } from "../../../fileUtils";
import { uploadEntries } from "../database";

const main = async () => {
  let files = await listFilesAsync(datasetsPath, { defaultValue: [] });

  // files = files.slice(0, 2); // TODO

  const entriesPerFile = await Promise.all(
    files.map(async (fileName) => {
      const withPath = path.join(datasetsPath, fileName);
      return await readJSONAsync(withPath, []);
    })
  );

  const entries = entriesPerFile.flat();

  console.log("TOTAL:", entries.length);

  const start = new Date();
  await uploadEntries(entries);
  const end = new Date();
  console.log(
    `>> runForAll > ${entries.length} entries in ${(end - start) / 1000} sec`
  );
};

main();
