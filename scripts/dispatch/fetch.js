const axios = require("axios").default;
import { readFileAsync, saveFileAsync, appendToFileAsync } from "./fileUtils";

const fetchNew = () => {
  let intervalId;
  const bearer = process.env.BEARER;
  if (!bearer) {
    console.error("No Bearer token, cannot auth");
    return;
  }

  console.log(`Bearer: ...${bearer.slice(bearer.length - 8)}`);

  const interval = 13 * 1011;
  const tick = async () => {
    try {
      const status = await readFileAsync("status.json", {});

      const config = {
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
        params: {
          screen_name: "SeaFDIncidents",
          exclude_replies: true,
          trim_user: true,
          count: 3,
        },
      };

      if (status && status.max_id) {
        config.params.max_id = status.max_id;
      }

      console.log(
        `fetch > requesting ${config.params.count} with max_id ${config.params.max_id}...`
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
      console.log(`fetch > received ${newData.length} new tweets`);

      const newTotal = await appendToFileAsync("unprocessed.json", newData, {
        dedupe: true,
      });
      const last = newData[newData.length - 1];
      const newStatus = {
        max_id: last.id_str,
        updated: new Date().toLocaleString(),
        fetched: newData.length,
        total: newTotal,
      };

      await saveFileAsync("status.json", newStatus);
      console.log(`fetch > new total: ${newTotal}`);
    } catch (e) {
      console.error("fetch >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  tick();
  intervalId = setInterval(tick, interval);
};

fetchNew();
