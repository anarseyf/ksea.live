import { runner as annotateRunner } from "./annotate";

const slowrunners = () => {
  const delay = 3600 * 1017;
  const tick = async () => {
    try {
      const start = new Date();

      await annotateRunner();

      const end = new Date();
      console.log(
        `slowrunners > (${end - start}ms), restarting in ${delay / 1000}sec`
      );
      setTimeout(tick, delay);
    } catch (e) {
      console.error("slowrunners >>> stopped due to error:", e);
    }
  };
  tick();
};

slowrunners();
