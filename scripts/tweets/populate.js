import { readFileAsync, saveFileAsync, writeWithLockAsync } from "./fileUtils";

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
  const interval = 5337;
  let intervalId;
  const tick = async () => {
    try {
      const unprocessed = await readFileAsync("unprocessed.json", []);
      const newPopulated = unprocessed.map(trim).map(addDerived);
      const populated = await readFileAsync("populated.json", []);
      const result = populated.concat(newPopulated);
      await saveFileAsync("populated.json", result);
      await saveFileAsync("unprocessed.json", []);
      console.log(
        `populate > ${newPopulated.length} new entries, ${result.length} total`
      );
    } catch (e) {
      console.error(
        "populate >>> Canceling 'populate' runner due to error:",
        e
      );
      clearInterval(intervalId);
    }
  };
  tick();
  intervalId = setInterval(tick, interval);
};

populate();
