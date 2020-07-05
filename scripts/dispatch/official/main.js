import { checkVersion } from "../version";
import { updateOnce } from "./scriptUtil";

const main = () => {
  const delay = 90 * 1000;
  const tick = async () => {
    try {
      const start = new Date();

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
