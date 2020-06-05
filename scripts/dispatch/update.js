const axios = require("axios").default;
import { readJSONAsync, saveJSONAsync, appendJSONAsync } from "./fileUtils";

const fetchNew = () => {
  let intervalId;
  const bearer = process.env.BEARER;
  if (!bearer) {
    console.error("No Bearer token, cannot auth");
    return;
  }

  console.log(`Bearer: ...${bearer.slice(bearer.length - 8)}`);

  const interval = 6 * 1011;
  const tick = async () => {
    try {
      const status = await readJSONAsync("status.json", {});

      if (!status || !status.since_id) {
        console.log(`update > no since_id, retrying in ${interval / 1000} sec`);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
        params: {
          screen_name: "SeaFDIncidents",
          exclude_replies: true,
          trim_user: true,
          count: 3,
          since_id: status.since_id,
        },
      };

      if (status.max_id_update) {
        config.params.max_id = status.max_id_update;
      }

      console.log(
        `update > requesting ${config.params.count} with max_id ${config.params.max_id}...`
      );

      const res = await axios
        .get("https://api.twitter.com/1.1/statuses/user_timeline.json", config)
        .catch((e) => {
          console.error(
            "user_timeline call failed:",
            e.response.status,
            e.stack
          );
          throw e.message;
        });

      const newData = res.data;
      console.log(`update > received ${newData.length} new tweets`);

      const newTotal = await appendJSONAsync("unprocessed.json", newData, {
        dedupe: true,
      });
      const last = newData[newData.length - 1];
      const newStatus = {
        ...status,
        max_id_update: last.id_str,
        updated: new Date().toLocaleString(),
        updatedBy: "update",
        fetched: newData.length,
        unprocessed: newTotal,
      };

      await saveJSONAsync("status.json", newStatus);
      console.log(`update > new total: ${newTotal}`);
    } catch (e) {
      console.error("update >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  tick();
  intervalId = setInterval(tick, interval);
};

fetchNew();
