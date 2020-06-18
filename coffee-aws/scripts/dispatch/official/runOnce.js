import { updateOnce } from "./scriptUtil";

const arg = process.argv[2];

if (!arg || !arg.length) {
  console.error("runOnce: missing argument");
  process.exit(1);
}

if (arg === "update") {
  updateOnce(true);
} else {
  console.error("runOnce: invalid argument: ", arg);
  process.exit(1);
}
