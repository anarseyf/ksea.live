const express = require("express");
const path = require("path");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");

import dispatchRouter from "./dispatchRouter";
import { checkVersion } from "./scripts/dispatch/version";
import { memoryUsageStr } from "./scripts/dispatch/memory";

checkVersion();

const app = express();

app.use(compression());
app.use(helmet());
app.use(morgan("dev"));

const port = process.env.PORT || process.env.port || 3001;
app.set("port", port);

const isProd = process.env.NODE_ENV === "production";
const staticPath = isProd ? "client/build" : "client/src";

function getSortedEnv() {
  if (isProd) {
    return { NODE_ENV: process.env.NODE_ENV };
  }

  const env = {};
  Object.keys(process.env)
    .sort()
    .forEach((k) => {
      env[k] = process.env[k];
    });

  return env;
}

app.use(express.static(path.join(__dirname, staticPath)));

app.get("/api/env", (req, res) => {
  res.json(getSortedEnv());
});

app.use("/api/dispatch", dispatchRouter);

const indexFile = path.join(__dirname, staticPath, "index.html");

app.get("/*", function (req, res) {
  res.sendFile(indexFile);
});

app.listen(port, () => {
  console.log(`${path.basename(__filename)} listening at :${port}`);

  console.log("server > memory usage:", memoryUsageStr());
});
