import { updateOnce } from "./scriptUtil";
import { runner as annotateRunner } from "./annotate";
import { runner as cacheRunner } from "./cache";

const arg = process.argv[2];

if (!arg || !arg.length) {
  console.error("runOnce: missing argument");
  process.exit(1);
}

if (arg === "update") {
  updateOnce(true);
} else if (arg === "annotate") {
  annotateRunner();
} else if (arg === "cache") {
  cacheRunner();
} else {
  console.error("runOnce: invalid argument: ", arg);
  process.exit(1);
}
