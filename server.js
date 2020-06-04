const express = require("express");
const path = require("path");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");

import dispatchRouter from "./dispatchRouter";

const app = express();

app.use(compression());
app.use(helmet());
app.use(morgan("dev"));

const isProd = process.env.NODE_ENV === "production";

const port = process.env.PORT || process.env.port || 3001;
app.set("port", port);

const staticPath = isProd ? "client/build" : "client/src";

function getSortedEnv() {
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

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "client/public", "index.html"));
});

app.listen(port, () => {
  console.log(`${path.basename(__filename)} listening at :${port}`);
});
