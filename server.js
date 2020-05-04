const express = require("express");
const app = express();
const port = 3001;

app.use(express.static("static"));

app.get("/", (req, res) => res.send("Hello World?"));

app.get("/api/data", (req, res) => {
  console.log("API/DATA call");
  const data = { payload: 42 };
  res.json(data);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
