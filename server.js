const express = require("express");
const path = require("path");
const compression = require("compression");
const helmet = require("helmet");
const rp = require("request-promise");

const app = express();

app.use(compression());
app.use(helmet());

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

app.get("/", (req, res) => res.send("Hello World"));

app.get("/api/env", (req, res) => {
  res.json(getSortedEnv());
});

app.get("/api/seattle911", async (req, res, next) => {
  const options = {
    uri: "https://data.seattle.gov/resource/fire-911.json",
    json: true,
  };

  console.log("911...");
  rp(options).then((json) => {
    console.log(`911: ${json.length} results`);
    res.json(json.slice(0, 10));
  });
});

app.listen(port, () => {
  console.log(`${path.basename(__filename)} listening at ${port}`);
});
