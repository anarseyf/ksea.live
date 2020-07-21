const mongoose = require("mongoose");
import { readJSONAsync } from "../../fileUtils";
import { withScriptsJsonPath } from "../../server/serverUtils";

const user = "ksea";
const pw = "mongoliamagnolia";
const db = "ksea";
const uri = `mongodb+srv://${user}:${pw}@ksea.zja0h.mongodb.net/${db}?retryWrites=true&w=majority`;

mongoose.set("useFindAndModify", false); // https://mongoosejs.com/docs/deprecations.html

const connect = () => mongoose.connect(uri);
let incidentSchema;
let Incident;

const init = () => {
  if (Incident) {
    return;
  }

  incidentSchema = new mongoose.Schema({
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

  Incident = mongoose.model("incident", incidentSchema);

  mongoose.model("testmodel", new mongoose.Schema({ test: String }));
};

export const uploadIncidents = async (table = []) => {
  init();

  return connect()
    .then(async (connection) => {
      const options = { upsert: true, new: true };

      // const file = withScriptsJsonPath("incidentsMap.json");
      // const incidentsMap = await readJSONAsync(file);
      // const table = Object.entries(incidentsMap).map(([k, [lat, long]]) => ({
      //   id: k,
      //   lat,
      //   long,
      // }));

      const start = new Date();
      for (let i = 0; i < table.length; i++) {
        const entry = table[i];
        await Incident.findOneAndUpdate({ id: entry.id }, entry, options);
      }

      const end = new Date();
      console.log(
        `database > saved ${table.length} entries in ${
          (end - start) / 1000
        } sec`
      );
    })
    .catch((e) => console.error("database > upload error:", e));
};

export const downloadIncidents = async (ids = []) => {
  const start = new Date();
  init();

  return connect()
    .then(async (connection) => {
      const query = { id: { $in: ids } }; // https://docs.mongodb.com/manual/tutorial/query-documents/
      const partition = { id: 1, lat: 1, long: 1 }; // https://mongoosejs.com/docs/api.html#query_Query-select

      const result = await Incident.find(query, partition);

      const end = new Date();
      console.log(
        `database > downloaded ${result.length} entries in ${
          (end - start) / 1000
        } sec`
      );
      console.log();
      return result;
    })
    .catch((e) => console.error("database > download error: ", e));
};
