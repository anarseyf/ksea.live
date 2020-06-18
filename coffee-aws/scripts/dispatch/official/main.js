import { checkVersion } from "../version";
import { updateOnce } from "./scriptUtil";

const setTZ = require("set-tz");
setTZ("America/Vancouver"); // TODO - use in all scripts

const main = () => {
  const delay = 15 * 1000;
  const tick = async () => {
    try {
      const start = new Date();

      /*
        TODO:
        - when splitting, merge similarly to combine (otherwise 'active' isn't cleared)
      */
      await updateOnce();

      const end = new Date();
      console.log(
        `main > (${end - start}ms), restarting in ${delay / 1000}sec`
      );
      setTimeout(tick, delay);
    } catch (e) {
      console.error("main >>> stopped due to error:", e);
    }
  };
  tick();
};

checkVersion();
main();
