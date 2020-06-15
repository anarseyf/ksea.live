import { severityMapper, removeSeattleWA } from "./mappers";
import { modifyAll } from "./scriptUtil";

const main = () => {
  try {
    modifyAll(removeSeattleWA);
  } catch (e) {
    console.error("modify >>> ", e);
  }
};

main();