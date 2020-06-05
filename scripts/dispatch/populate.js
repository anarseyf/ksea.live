import { readJSONAsync, saveJSONAsync, appendJSONAsync } from "./fileUtils";
import { pathToScriptsJson } from "./utils";

const addDerived = ({ id_str, text, created_at, derived, ...rest }) => {
  const delimiter = " - ";
  const pieces = text.split(delimiter);
  const count = pieces.length;
  let description, address, units, time;
  if (count >= 4) {
    description = pieces.slice(0, count - 3).join(delimiter);
    address = `${pieces[count - 3]},Seattle,WA`;
    units = pieces[count - 2];
    time = pieces[count - 1];
  } else {
    console.warn(`Unable to parse text of tweet ${id_str}`);
  }

  return {
    id_str,
    text,
    created_at,
    ...rest,
    derived: {
      ...derived,
      timestamp: +new Date(created_at),
      description,
      address,
      units,
      time,
    },
  };
};

const trim = ({ text, created_at, id_str, derived }) => ({
  text,
  created_at,
  id_str,
  derived,
});

const populate = () => {
  const interval = 5 * 1137;
  let intervalId;
  const tick = async () => {
    try {
      const unprocessed = await readJSONAsync(
        pathToScriptsJson("unprocessed.json"),
        []
      );
      const newData = unprocessed.map(trim).map(addDerived);
      const newTotal = await appendJSONAsync(
        pathToScriptsJson("populated.json"),
        newData
      );
      await saveJSONAsync(pathToScriptsJson("unprocessed.json"), []);
      console.log(`populate > new total: ${newTotal}`);
    } catch (e) {
      console.error("populate >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  tick();
  intervalId = setInterval(tick, interval);
};

populate();
