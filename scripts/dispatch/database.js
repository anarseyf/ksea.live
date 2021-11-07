const mongoose = require("mongoose");

const user = process.env.MONGO_USER || "ksea";
const pw = process.env.MONGO_PW || "ksea";
const db = process.env.MONGO_DB;
const uri = `mongodb+srv://${user}:${pw}@ksea.zja0h.mongodb.net/${db}?retryWrites=true&w=majority`;

mongoose.set("useFindAndModify", false); // https://mongoosejs.com/docs/deprecations.html
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

const connect = () => mongoose.connect(uri);

let incidentSchema;
let Incident;

let entrySchema;
let Entry;

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

  entrySchema = new mongoose.Schema({
    id_str: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
    },
    address: {
      type: String,
    },
    created_at: {
      type: String,
    },
    lat: {
      type: Number,
    },
    long: {
      type: Number,
    },
    description: {
      type: String,
    },
    neighborhood: {
      type: String,
    },
    neighborhoodGroup: {
      type: String,
    },
    severity: {
      type: Number,
    },
    timestamp: {
      type: Number,
      required: true,
    },
    unitCount: {
      type: Number,
    },
    units: {
      type: String,
    },
    /*
        "id_str": "F200059150",
    "created_at": "6/16/2020 4:41:35 PM",
    "lat": 47.549748,
    "long": -122.286273,
    "timestamp": 1592350895000,
    "description": "Alarm Bell",
    "address": "5900 37th Av S",
    "active": false,
    "unitCount": 2,
    "severity": 0,
    "neighborhood": "Columbia City",
    "neighborhoodGroup": "Southeast",
    "units": "E28 L12"
    */
  });

  entrySchema.index({ id_str: 1 }, { unique: true });

  Entry = mongoose.model("entry", entrySchema);
};

export const testEntry = async () => {
  init();

  connect().then(async () => {
    const options = { upsert: true, new: true };

    const entry = {
      id_str: "F200059150",
      created_at: "6/16/2020 4:41:35 PM",
      lat: 47.549748,
      long: -122.286273,
      timestamp: 1592350895000,
      description: "Alarm Bell",
      address: "5900 37th Av S",
      active: false,
      unitCount: 2,
      severity: 0,
      neighborhood: "Columbia City",
      neighborhoodGroup: "Southeast",
      units: "E28 L12",
    };
    const result = await Entry.findOneAndUpdate(
      { id_str: entry.id_str },
      entry,
      options
    );

    console.log("test entry > ", result);
  });
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
      mongoose.connection.close();
      return result;
    })
    .catch((e) => console.error("database > download error: ", e))
    .finally(() => {
      mongoose.connection.close();
    });
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
        `database > saved ${table.length} Incidents in ${
          (end - start) / 1000
        } sec`
      );
    })
    .catch((e) => console.error("database > upload error:", e))
    .finally(() => {
      mongoose.connection.close();
    });
};

export const uploadEntries = async (table = []) => {
  init();

  return connect()
    .then(async (connection) => {
      const options = { upsert: true, new: true };

      const start = new Date();
      for (let i = 0; i < table.length; i++) {
        const entry = table[i];
        await Entry.findOneAndUpdate({ id_str: entry.id_str }, entry, options);

        if (i % 100 === 0) {
          const t = new Date();
          console.log(
            `database > saved ${i} Entries, ${(t - start) / 1000} sec`
          );
        }
      }

      const end = new Date();
      console.log(
        `database > done: ${table.length} Entries in ${
          (end - start) / 1000
        } sec`
      );
    })
    .catch((e) => console.error("database > upload error:", e))
    .finally(() => {
      mongoose.connection.close();
    });
};
