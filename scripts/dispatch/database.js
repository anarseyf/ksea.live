const mongoose = require("mongoose");
import { readJSONAsync } from "../../fileUtils";
import { withScriptsJsonPath } from "../../server/serverUtils";

const user = "ksea";
const pw = "mongoliamagnolia";
const db = "ksea";
const uri = `mongodb+srv://${user}:${pw}@ksea.zja0h.mongodb.net/${db}?retryWrites=true&w=majority`;

const connect = () => mongoose.connect(uri);

const incidentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    index: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
});

incidentSchema.index({ id: 1 }, { unique: true });

const Incident = mongoose.model("incident", incidentSchema);

connect()
  .then(async (connection) => {
    // const arr = [
    //   { id: "TEST3", lat: 40, long: -120 },
    //   { id: "TEST3", lat: 41, long: -121 },
    // ];
    const i1 = { id: "TEST3", lat: 40, long: -120 };
    const i2 = { id: "TEST3", lat: 41, long: -120 };
    const options = { upsert: true, new: true };
    let result = await Incident.findOneAndUpdate({ id: "TEST3" }, i1, options);
    console.log("Result 1:", result);
    result = await Incident.findOneAndUpdate({ id: "TEST3" }, i2, options);
    console.log("Result 2:", result);

    // const file = withScriptsJsonPath("incidentsMap.json");
    // const incidentsMap = await readJSONAsync(file);
    // const table = Object.entries(incidentsMap).map(([k, [lat, long]]) => ({
    //   id: k,
    //   lat,
    //   long,
    // }));
    // console.log(table[0]);
  })
  .catch((e) => console.error("Error:", e));
