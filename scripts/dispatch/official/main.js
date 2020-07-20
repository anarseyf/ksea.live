import { checkVersion } from "../version";
import { updateOnce } from "./scriptUtil";
import { memoryUsageStr } from "../memory";

const main = () => {
  const delay = 60 * 1000;
  const tick = async () => {
    try {
      const start = new Date();

      console.log("main > memory usage:", memoryUsageStr());
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
