const express = require("express");
const path = require("path");
const app = express();
const port = 3001;

app.use(express.static("static"));

app.set("port", process.env.PORT || port);

const staticPath =
  process.env.NODE_ENV === "production" ? "client/build" : "client/src";
app.use(express.static(path.join(__dirname, staticPath)));

app.get("/", (req, res) => res.send("Hello World?"));

app.get("/api/env", (req, res) => {
  res.json({ nodeEnv: process.env.NODE_ENV || "" });
});

app.get("/api/data", (req, res) => {
  const data = { payload: 42 };
  res.json(data);
});

app.listen(port, () =>
  console.log(`${path.basename(__filename)} listening at :${port}`)
);
