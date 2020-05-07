const express = require("express");
const path = require("path");
const app = express();

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

app.get("/", (req, res) => res.send("Hello World?"));

app.get("/api/env", (req, res) => {
  res.json(getSortedEnv());
});

app.get("/api/data", (req, res) => {
  const data = { payload: 42 };
  res.json(data);
});

app.listen(port, () => {
  console.log(`${path.basename(__filename)} listening at ${port}`);
  console.log(`env: ${JSON.stringify(getSortedEnv(), null, 4)}`);
});
