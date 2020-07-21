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
    const options = { upsert: true, new: true };

    const file = withScriptsJsonPath("incidentsMap.json");
    const incidentsMap = await readJSONAsync(file);
    const table = Object.entries(incidentsMap).map(([k, [lat, long]]) => ({
      id: k,
      lat,
      long,
    }));

    const start = new Date();
    // for (let i = 0; i < table.length; i++) {
    //   const entry = table[i];
    //   await Incident.findOneAndUpdate({ id: entry.id }, entry, options);
    // }
    const result = await Incident.find({});
    console.log("Result: ", result.length, result[0]);

    const end = new Date();
    console.log(
      `database > ${table.length} entries in ${(end - start) / 1000} seconds`
    );
  })
  .catch((e) => console.error("Error:", e));
