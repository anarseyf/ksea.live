const express = require("express");
const path = require("path");
const compression = require("compression");
const helmet = require("helmet");
const rp = require("request-promise");
const fs = require("fs");
const util = require("util");

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

app.use((req, res, next) => {
    console.log(`>>> ${req.method} ${req.url}`);
    next();
});

app.get("/api/env", (req, res) => {
    res.json(getSortedEnv());
});

app.get("/api/seattle911/static", async (req, res, next) => {
    const readFile = util.promisify(fs.readFile);
    const file = await readFile("datasets/seattle911.json");
    res.json(JSON.parse(file).slice(0, 50));
});

app.get("/api/seattle911", async (req, res, next) => {
    const options = {
        uri: "https://data.seattle.gov/resource/fire-911.json",
        json: true,
        qs: {
            $limit: 10,
            $where: "date_extract_y(datetime) >= 2020",
            $$app_token: "DvY4gobAudCWKcwYz3yqTd25h", // https://data.seattle.gov/profile/edit/developer_settings
        },
    };

    const start = +new Date();
    rp(options).then((json) => {
        const end = +new Date();
        const latency = (end - start) / 1000;
        res.json(json);
    });
});

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, staticPath, "index.html"));
});

app.listen(port, () => {
    console.log(`${path.basename(__filename)} listening at :${port}`);
});
